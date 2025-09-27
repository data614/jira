from unittest import mock

import pytest
from django.db.utils import OperationalError
from redis.exceptions import RedisError

from plane.utils.monitoring import MonitoringService, ServiceCheckResult


class DummyRequest:
    def __init__(self, url: str) -> None:
        self._url = url

    def build_absolute_uri(self, path: str) -> str:
        assert path == "/"
        return self._url


@pytest.fixture()
def fake_redis_client():
    client = mock.MagicMock()
    client.get.return_value = None
    return client


def test_run_checks_ok(fake_redis_client):
    service = MonitoringService(redis_factory=lambda: fake_redis_client)

    with mock.patch.object(service, "check_postgres", return_value=ServiceCheckResult.success(1.2)):
        with mock.patch.object(service, "check_redis", return_value=ServiceCheckResult.success(0.8)):
            fake_redis_client.get.return_value = b"https://plane.example.com/"
            payload = service.run_checks()

    assert payload["status"] == "OK"
    assert payload["services"]["postgresql"]["available"] is True
    assert payload["services"]["redis"]["available"] is True
    assert payload["publicEndpoint"] == "https://plane.example.com/"
    assert "issues" not in payload


def test_run_checks_degraded(fake_redis_client):
    service = MonitoringService(redis_factory=lambda: fake_redis_client)

    with mock.patch.object(service, "check_postgres", return_value=ServiceCheckResult.failure("db unavailable")):
        with mock.patch.object(service, "check_redis", return_value=ServiceCheckResult.success(0.8)):
            payload = service.run_checks()

    assert payload["status"] == "DEGRADED"
    assert payload["services"]["postgresql"]["available"] is False
    assert "postgresql" in payload["issues"]


def test_record_public_endpoint_normalises(fake_redis_client):
    service = MonitoringService(redis_factory=lambda: fake_redis_client)

    fake_redis_client.get.return_value = None
    service.record_public_endpoint(DummyRequest("https://plane.example.com///"))

    fake_redis_client.set.assert_called_once_with(
        service.PUBLIC_ENDPOINT_KEY,
        "https://plane.example.com/",
    )


def test_store_public_endpoint_ignores_empty(fake_redis_client):
    service = MonitoringService(redis_factory=lambda: fake_redis_client)

    service.store_public_endpoint("   ")

    fake_redis_client.get.assert_not_called()
    fake_redis_client.set.assert_not_called()


def test_check_postgres_failure(monkeypatch, fake_redis_client):
    service = MonitoringService(redis_factory=lambda: fake_redis_client)

    fake_connection = mock.MagicMock()
    fake_connection.ensure_connection.side_effect = OperationalError("cannot connect")

    with mock.patch("plane.utils.monitoring.connections") as mock_connections:
        mock_connections.__getitem__.return_value = fake_connection
        result = service.check_postgres()

    assert result.available is False
    assert result.error == "cannot connect"


def test_check_redis_failure():
    failing_factory = mock.MagicMock(side_effect=RedisError("redis down"))
    service = MonitoringService(redis_factory=failing_factory)

    result = service.check_redis()

    assert result.available is False
    assert result.error == "redis down"
