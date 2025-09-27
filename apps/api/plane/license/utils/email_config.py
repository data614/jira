"""Utilities for resolving SMTP configuration values."""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional, Tuple

DEFAULT_FROM_EMAIL = "Team Plane <team@mailer.plane.so>"
DEFAULT_SMTP_PORT = 587
SENDGRID_DEFAULT_HOST = "smtp.sendgrid.net"
SENDGRID_DEFAULT_USERNAME = "apikey"

logger = logging.getLogger("plane.license.email")
_SENDGRID_LOGGED = False


def _clean_str(value: Optional[object]) -> str:
    """Return a trimmed string representation of value or an empty string."""
    if value is None:
        return ""
    return str(value).strip()


def _normalize_flag(value: Optional[str], default: str) -> str:
    """Ensure boolean-like string values are coerced to "0" or "1"."""
    cleaned = _clean_str(value)
    if cleaned in {"0", "1"}:
        return cleaned
    return default


def _normalize_port(value: Optional[object]) -> str:
    """Normalize the SMTP port to a non-empty string."""
    cleaned = _clean_str(value)
    return cleaned or str(DEFAULT_SMTP_PORT)


@dataclass
class EmailConfig:
    """Represents the primary SMTP configuration."""

    host: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    port: Optional[object] = None
    use_tls: Optional[str] = None
    use_ssl: Optional[str] = None
    from_email: Optional[str] = None

    def as_tuple(self) -> Tuple[str, str, str, str, str, str, str]:
        """Return the configuration as a tuple expected by legacy callers."""
        return (
            _clean_str(self.host),
            _clean_str(self.username),
            _clean_str(self.password),
            _normalize_port(self.port),
            _normalize_flag(self.use_tls, "1"),
            _normalize_flag(self.use_ssl, "0"),
            _clean_str(self.from_email) or DEFAULT_FROM_EMAIL,
        )


@dataclass
class SendGridSettings:
    """Represents optional SendGrid SMTP configuration overrides."""

    api_key: Optional[str] = None
    host: Optional[str] = None
    port: Optional[object] = None
    username: Optional[str] = None
    use_tls: Optional[str] = None
    use_ssl: Optional[str] = None
    from_email: Optional[str] = None

    def is_configured(self) -> bool:
        return bool(_clean_str(self.api_key))


def apply_sendgrid_overrides(base: EmailConfig, sendgrid: SendGridSettings) -> EmailConfig:
    """Populate empty SMTP values from SendGrid configuration when available."""
    if _clean_str(base.host):
        return base

    if not sendgrid.is_configured():
        return base

    global _SENDGRID_LOGGED
    if not _SENDGRID_LOGGED:
        logger.info("Falling back to SendGrid SMTP configuration for outbound email.")
        _SENDGRID_LOGGED = True

    base.host = _clean_str(sendgrid.host) or SENDGRID_DEFAULT_HOST
    base.username = _clean_str(sendgrid.username) or SENDGRID_DEFAULT_USERNAME
    base.password = _clean_str(sendgrid.api_key)
    base.port = (
        _normalize_port(sendgrid.port)
        if _clean_str(sendgrid.port)
        else _normalize_port(base.port)
    )
    # Prioritise explicit SendGrid flags, otherwise respect existing configuration.
    base.use_tls = _normalize_flag(
        sendgrid.use_tls, _normalize_flag(base.use_tls, "1")
    )
    base.use_ssl = _normalize_flag(
        sendgrid.use_ssl, _normalize_flag(base.use_ssl, "0")
    )

    current_from_email = _clean_str(base.from_email)
    if not current_from_email or current_from_email == DEFAULT_FROM_EMAIL:
        base.from_email = _clean_str(sendgrid.from_email) or current_from_email

    return base


def is_smtp_configured(host: Optional[str], sendgrid_api_key: Optional[str]) -> bool:
    """Return True when SMTP credentials are present via host or SendGrid API key."""
    return bool(_clean_str(host)) or bool(_clean_str(sendgrid_api_key))


__all__ = [
    "DEFAULT_FROM_EMAIL",
    "DEFAULT_SMTP_PORT",
    "SENDGRID_DEFAULT_HOST",
    "SENDGRID_DEFAULT_USERNAME",
    "EmailConfig",
    "SendGridSettings",
    "apply_sendgrid_overrides",
    "is_smtp_configured",
]
