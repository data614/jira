"""Utilities for monitoring Plane services and infrastructure health."""
from __future__ import annotations

import logging
from dataclasses import dataclass
from time import perf_counter
from typing import Any, Callable, Dict, Optional

from django.db import DEFAULT_DB_ALIAS, connections
from django.db.utils import OperationalError
from redis.exceptions import RedisError

from plane.settings.redis import redis_instance

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ServiceCheckResult:
    """Represents the outcome of an individual service health check."""

    available: bool
    latency_ms: Optional[float] = None
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Return a serialisable dictionary representation of the result."""

        payload: Dict[str, Any] = {"available": self.available}

        if self.latency_ms is not None:
            # Provide millisecond precision rounded to two decimal places.
            payload["latencyMs"] = round(self.latency_ms, 2)

        if self.error:
            payload["error"] = self.error

        return payload

    @classmethod
    def success(cls, latency_ms: float) -> "ServiceCheckResult":
        return cls(available=True, latency_ms=latency_ms)

    @classmethod
    def failure(cls, error: str) -> "ServiceCheckResult":
        return cls(available=False, error=error)


class MonitoringService:
    """Enterprise-grade service monitoring for Plane."""

    PUBLIC_ENDPOINT_KEY = "plane:monitoring:public-endpoint"

    def __init__(self, redis_factory: Optional[Callable[[], Any]] = None) -> None:
        # Use the shared Redis/PostgreSQL infrastructure. The factory makes testing easier
        # and avoids instantiating connections before they are needed.
        self._redis_factory = redis_factory or redis_instance

    def _redis_client(self):
        return self._redis_factory()

    def check_postgres(self) -> ServiceCheckResult:
        """Run a lightweight query against PostgreSQL to verify availability."""

        start_time = perf_counter()
        connection = connections[DEFAULT_DB_ALIAS]

        try:
            connection.ensure_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
        except OperationalError as exc:
            logger.exception("PostgreSQL health check failed: %s", exc)
            return ServiceCheckResult.failure(str(exc))
        except Exception as exc:  # pragma: no cover - defensive fallback
            logger.exception("Unexpected PostgreSQL health check failure: %s", exc)
            return ServiceCheckResult.failure(str(exc))

        latency_ms = (perf_counter() - start_time) * 1000
        return ServiceCheckResult.success(latency_ms)

    def check_redis(self) -> ServiceCheckResult:
        """Ping Redis to confirm connectivity and responsiveness."""

        start_time = perf_counter()

        try:
            client = self._redis_client()
            client.ping()
        except RedisError as exc:
            logger.exception("Redis health check failed: %s", exc)
            return ServiceCheckResult.failure(str(exc))
        except Exception as exc:  # pragma: no cover - defensive fallback
            logger.exception("Unexpected Redis health check failure: %s", exc)
            return ServiceCheckResult.failure(str(exc))

        latency_ms = (perf_counter() - start_time) * 1000
        return ServiceCheckResult.success(latency_ms)

    def run_checks(self) -> Dict[str, Any]:
        """Execute all health checks and return a consolidated response."""

        postgres_result = self.check_postgres()
        redis_result = self.check_redis()

        services = {
            "postgresql": postgres_result.to_dict(),
            "redis": redis_result.to_dict(),
        }

        overall_status = "OK" if all(result["available"] for result in services.values()) else "DEGRADED"

        response: Dict[str, Any] = {"status": overall_status, "services": services}

        public_endpoint = self.get_public_endpoint()
        if public_endpoint:
            response["publicEndpoint"] = public_endpoint

        # Highlight degraded services for quick diagnostics.
        degraded = [name for name, result in services.items() if not result["available"]]
        if degraded:
            response["issues"] = degraded

        return response

    def normalise_endpoint(self, endpoint: str) -> Optional[str]:
        """Normalise a raw endpoint string before persisting it."""

        if not endpoint:
            return None

        normalised = endpoint.strip()
        if not normalised:
            return None

        normalised = normalised.rstrip("/") + "/"
        return normalised

    def record_public_endpoint(self, request) -> None:
        """Capture the public endpoint from an incoming request for later reuse."""

        if request is None:
            return

        endpoint = request.build_absolute_uri("/")
        self.store_public_endpoint(endpoint)

    def store_public_endpoint(self, endpoint: str) -> None:
        normalised = self.normalise_endpoint(endpoint)
        if not normalised:
            return

        try:
            client = self._redis_client()
            existing = client.get(self.PUBLIC_ENDPOINT_KEY)
            if isinstance(existing, bytes):
                existing = existing.decode("utf-8")

            if existing != normalised:
                client.set(self.PUBLIC_ENDPOINT_KEY, normalised)
        except RedisError as exc:
            logger.warning("Unable to persist public endpoint: %s", exc)
        except Exception as exc:  # pragma: no cover - defensive fallback
            logger.warning("Unexpected error while persisting public endpoint: %s", exc)

    def get_public_endpoint(self) -> Optional[str]:
        try:
            client = self._redis_client()
            value = client.get(self.PUBLIC_ENDPOINT_KEY)
        except RedisError as exc:
            logger.warning("Unable to read public endpoint: %s", exc)
            return None
        except Exception as exc:  # pragma: no cover - defensive fallback
            logger.warning("Unexpected error while reading public endpoint: %s", exc)
            return None

        if isinstance(value, bytes):
            return value.decode("utf-8")

        return value


monitoring_service = MonitoringService()

__all__ = ["MonitoringService", "ServiceCheckResult", "monitoring_service"]
