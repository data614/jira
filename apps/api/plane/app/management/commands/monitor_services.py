"""Health check command for core service dependencies."""

from __future__ import annotations

import json
import socket
import time
from typing import Any, Dict

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from django.db.utils import OperationalError

from kombu import Connection

from plane.settings.redis import redis_instance


HealthStatus = Dict[str, Any]


class Command(BaseCommand):
    """Checks connectivity to the database, Redis, and RabbitMQ brokers."""

    help = "Verify connectivity to Plane's external dependencies"

    def add_arguments(self, parser):  # type: ignore[override]
        parser.add_argument(
            "--json",
            action="store_true",
            help="Return the results as JSON for machine consumption.",
        )
        parser.add_argument(
            "--timeout",
            type=float,
            default=5.0,
            help="Maximum seconds to wait for each dependency before marking it unhealthy.",
        )

    def handle(self, *args, **options):  # type: ignore[override]
        timeout = float(options["timeout"])
        json_output = bool(options["json"])

        results: Dict[str, HealthStatus] = {
            "database": self._check_database(timeout),
            "redis": self._check_redis(timeout),
            "rabbitmq": self._check_rabbitmq(timeout),
        }

        if json_output:
            self.stdout.write(json.dumps(results, indent=2, sort_keys=True))
        else:
            for name, details in results.items():
                status = details["status"].upper()
                summary = details.get("summary", "")
                latency = details.get("latency_ms")
                latency_display = f" ({latency:.2f} ms)" if latency is not None else ""
                message = f"{name}: {status}{latency_display}"
                if summary:
                    message = f"{message} – {summary}"
                self.stdout.write(message)

        unhealthy = [
            component
            for component, details in results.items()
            if details["status"] not in {"healthy", "skipped"}
        ]

        if unhealthy:
            raise CommandError(
                f"Unhealthy dependencies detected: {', '.join(sorted(unhealthy))}"
            )

    def _check_database(self, timeout: float) -> HealthStatus:
        start = time.perf_counter()
        connection = connections["default"]
        statement_timeout_ms = max(int(timeout * 1000), 1)

        try:
            connection.ensure_connection()
            with connection.cursor() as cursor:
                if connection.vendor == "postgresql":
                    cursor.execute("SET statement_timeout = %s;", [statement_timeout_ms])
                cursor.execute("SELECT 1;")
                cursor.fetchone()
        except OperationalError as exc:
            return self._unhealthy_result("database", exc)
        except Exception as exc:  # pragma: no cover - protect against driver edge cases
            return self._unhealthy_result("database", exc)
        finally:
            if connection.vendor == "postgresql":
                raw_connection = getattr(connection, "connection", None)
                if raw_connection is not None:
                    try:
                        with connection.cursor() as cursor:
                            cursor.execute("RESET statement_timeout;")
                    except Exception:
                        # If the connection has gone away we have already recorded the error.
                        pass

        return self._healthy_result(start)

    def _check_redis(self, timeout: float) -> HealthStatus:
        redis_client = redis_instance()
        start = time.perf_counter()
        try:
            redis_client.ping()
        except Exception as exc:  # pragma: no cover - redis raises redis.exceptions.*
            return self._unhealthy_result("redis", exc)
        else:
            return self._healthy_result(start)

    def _check_rabbitmq(self, timeout: float) -> HealthStatus:
        broker_url = getattr(settings, "CELERY_BROKER_URL", "")
        if not broker_url:
            return {
                "status": "skipped",
                "summary": "CELERY_BROKER_URL is not configured; skipping RabbitMQ check.",
            }

        start = time.perf_counter()
        try:
            with Connection(broker_url, connect_timeout=timeout) as connection:
                connection.ensure_connection(max_retries=0)
        except Exception as exc:  # pragma: no cover - kombu raises amqp exceptions
            return self._unhealthy_result("rabbitmq", exc)
        else:
            return self._healthy_result(start)

    def _healthy_result(self, start_time: float) -> HealthStatus:
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        return {
            "status": "healthy",
            "latency_ms": elapsed_ms,
        }

    def _unhealthy_result(self, component: str, exc: Exception) -> HealthStatus:
        hostname = socket.gethostname()
        return {
            "status": "unhealthy",
            "summary": f"{component} check failed on host {hostname}: {exc}",
        }
