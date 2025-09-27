import pytest
from django.test import override_settings

from plane.license.utils.email_config import (
    DEFAULT_SMTP_PORT,
    SENDGRID_DEFAULT_HOST,
    SENDGRID_DEFAULT_USERNAME,
    is_smtp_configured,
)
from plane.license.utils.instance_value import get_email_configuration

EMAIL_ENV_KEYS = [
    "EMAIL_HOST",
    "EMAIL_HOST_USER",
    "EMAIL_HOST_PASSWORD",
    "EMAIL_PORT",
    "EMAIL_USE_TLS",
    "EMAIL_USE_SSL",
    "EMAIL_FROM",
    "SENDGRID_API_KEY",
    "SENDGRID_SMTP_HOST",
    "SENDGRID_SMTP_PORT",
    "SENDGRID_SMTP_USERNAME",
    "SENDGRID_SMTP_USE_TLS",
    "SENDGRID_SMTP_USE_SSL",
    "SENDGRID_FROM_EMAIL",
]


@pytest.fixture(autouse=True)
def clear_email_environment(monkeypatch):
    for key in EMAIL_ENV_KEYS:
        monkeypatch.delenv(key, raising=False)
    yield


@pytest.fixture
def use_env_settings():
    with override_settings(SKIP_ENV_VAR=False):
        yield


def test_get_email_configuration_prefers_explicit_settings(monkeypatch, use_env_settings):
    monkeypatch.setenv("EMAIL_HOST", "smtp.example.com")
    monkeypatch.setenv("EMAIL_HOST_USER", "admin")
    monkeypatch.setenv("EMAIL_HOST_PASSWORD", "secret")
    monkeypatch.setenv("EMAIL_PORT", "2525")
    monkeypatch.setenv("EMAIL_USE_TLS", "0")
    monkeypatch.setenv("EMAIL_USE_SSL", "1")
    monkeypatch.setenv("EMAIL_FROM", "Plane <plane@example.com>")
    monkeypatch.setenv("SENDGRID_API_KEY", "SG.fake-key")

    config = get_email_configuration()

    assert config == (
        "smtp.example.com",
        "admin",
        "secret",
        "2525",
        "0",
        "1",
        "Plane <plane@example.com>",
    )


def test_get_email_configuration_falls_back_to_sendgrid(monkeypatch, use_env_settings):
    monkeypatch.setenv("SENDGRID_API_KEY", "SG.sendgrid")
    monkeypatch.setenv("SENDGRID_FROM_EMAIL", "no-reply@example.com")

    config = get_email_configuration()

    assert config[0] == SENDGRID_DEFAULT_HOST
    assert config[1] == SENDGRID_DEFAULT_USERNAME
    assert config[2] == "SG.sendgrid"
    assert config[3] == str(DEFAULT_SMTP_PORT)
    assert config[4] == "1"
    assert config[5] == "0"
    assert config[6] == "no-reply@example.com"


def test_get_email_configuration_respects_sendgrid_overrides(monkeypatch, use_env_settings):
    monkeypatch.setenv("SENDGRID_API_KEY", "SG.override")
    monkeypatch.setenv("SENDGRID_SMTP_PORT", "465")
    monkeypatch.setenv("SENDGRID_SMTP_USE_TLS", "0")
    monkeypatch.setenv("SENDGRID_SMTP_USE_SSL", "1")

    config = get_email_configuration()

    assert config[3] == "465"
    assert config[4] == "0"
    assert config[5] == "1"


def test_is_smtp_configured_helper():
    assert is_smtp_configured("smtp.example.com", "")
    assert is_smtp_configured("", "SG.fake")
    assert not is_smtp_configured("", "")
