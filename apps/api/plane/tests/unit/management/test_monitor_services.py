"""Unit tests for the monitor_services management command."""

import io
import json
from typing import Dict

import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from plane.app.management.commands.monitor_services import Command


@pytest.fixture
def fake_results() -> Dict[str, Dict[str, object]]:
    """Return canned health check data."""
    return {
        "database": {"status": "healthy", "latency_ms": 10.0},
        "redis": {"status": "healthy", "latency_ms": 5.5},
        "rabbitmq": {"status": "skipped", "summary": "disabled"},
    }


@pytest.mark.unit
def test_monitor_services_json_output(monkeypatch, fake_results):
    """The command should emit JSON when requested."""

    monkeypatch.setattr(Command, "_check_database", lambda self, timeout: fake_results["database"])
    monkeypatch.setattr(Command, "_check_redis", lambda self, timeout: fake_results["redis"])
    monkeypatch.setattr(Command, "_check_rabbitmq", lambda self, timeout: fake_results["rabbitmq"])

    stdout = io.StringIO()
    call_command("monitor_services", json=True, timeout=1.0, stdout=stdout)

    payload = json.loads(stdout.getvalue())
    assert payload == fake_results


@pytest.mark.unit
def test_monitor_services_raises_error_on_unhealthy(monkeypatch, fake_results):
    """Unhealthy dependencies should raise a CommandError."""

    unhealthy = {"status": "unhealthy", "summary": "broken"}

    monkeypatch.setattr(Command, "_check_database", lambda self, timeout: unhealthy)
    monkeypatch.setattr(Command, "_check_redis", lambda self, timeout: fake_results["redis"])
    monkeypatch.setattr(Command, "_check_rabbitmq", lambda self, timeout: fake_results["rabbitmq"])

    stdout = io.StringIO()
    with pytest.raises(CommandError) as exc_info:
        call_command("monitor_services", stdout=stdout)

    assert "Unhealthy dependencies detected" in str(exc_info.value)


@pytest.mark.unit
def test_monitor_services_rabbitmq_skipped(settings):
    """RabbitMQ should be skipped when no broker URL is configured."""

    settings.CELERY_BROKER_URL = ""
    command = Command()

    result = command._check_rabbitmq(timeout=0.1)

    assert result["status"] == "skipped"
    assert "skipping" in result["summary"].lower()
