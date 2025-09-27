import logging
import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application

from plane.utils.telemetry import init_tracer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "plane.settings.production")

try:
    init_tracer()
except Exception as exc:  # pragma: no cover - defensive logging
    logging.getLogger("plane.observability").warning(
        "Failed to initialize backend APM for ASGI startup.",
        extra={"error": str(exc), "channel": "observability", "event": "apm_startup_failed"},
    )

django_asgi_app = get_asgi_application()

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.

application = ProtocolTypeRouter({"http": get_asgi_application()})
