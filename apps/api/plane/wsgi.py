"""WSGI config for Plane project with observability hooks."""

import logging
import os

from django.core.wsgi import get_wsgi_application

from plane.utils.telemetry import init_tracer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "plane.settings.production")

try:
    init_tracer()
except Exception as exc:  # pragma: no cover - defensive logging
    logging.getLogger("plane.observability").warning(
        "Failed to initialize backend APM for WSGI startup.",
        extra={"error": str(exc), "channel": "observability", "event": "apm_startup_failed"},
    )

application = get_wsgi_application()
