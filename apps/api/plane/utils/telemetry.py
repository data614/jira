"""Utilities to configure application observability and tracing."""

# Python imports
import atexit
import logging
import os
from typing import Dict, Optional

# Third party imports
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

logger = logging.getLogger("plane.observability")

_TRACER_PROVIDER: Optional[TracerProvider] = None
_DJANGO_INSTRUMENTED = False


def _is_truthy(value: Optional[str]) -> bool:
    if value is None:
        return False
    return value.lower() in {"1", "true", "yes", "on"}


def _is_apm_enabled() -> bool:
    explicit = os.environ.get("ENABLE_BACKEND_APM") or os.environ.get(
        "ENABLE_OTEL_TRACES"
    )
    if explicit is not None:
        return _is_truthy(explicit)
    if os.environ.get("OTLP_ENDPOINT"):
        return True
    return False


def _resolve_otlp_headers() -> Optional[Dict[str, str]]:
    headers = os.environ.get("OTLP_HEADERS")
    if not headers:
        return None
    parsed: Dict[str, str] = {}
    for pair in headers.split(","):
        if not pair:
            continue
        if "=" not in pair:
            continue
        key, value = pair.split("=", 1)
        parsed[key.strip()] = value.strip()
    return parsed or None


def init_tracer() -> Optional[TracerProvider]:
    """Initialize OpenTelemetry with proper shutdown handling."""

    global _TRACER_PROVIDER
    global _DJANGO_INSTRUMENTED

    if not _is_apm_enabled():
        logger.debug("Backend APM instrumentation disabled by configuration.")
        return None

    if _TRACER_PROVIDER is not None:
        return _TRACER_PROVIDER

    service_name = os.environ.get("SERVICE_NAME", "plane-ce-api")
    resource = Resource.create({"service.name": service_name})
    tracer_provider = TracerProvider(resource=resource)

    trace.set_tracer_provider(tracer_provider)

    endpoint = os.environ.get("OTLP_ENDPOINT", "https://telemetry.plane.so")
    headers = _resolve_otlp_headers()
    insecure = _is_truthy(os.environ.get("OTLP_INSECURE"))

    try:
        exporter = OTLPSpanExporter(endpoint=endpoint, headers=headers, insecure=insecure)
    except Exception as exc:  # pragma: no cover - defensive logging
        logger.warning(
            "Failed to configure OTLP exporter; backend APM will remain disabled.",
            extra={
                "channel": "observability",
                "event": "apm_init_failed",
                "error": str(exc),
            },
        )
        return None

    span_processor = BatchSpanProcessor(exporter)
    tracer_provider.add_span_processor(span_processor)

    if not _DJANGO_INSTRUMENTED:
        try:
            DjangoInstrumentor().instrument()
            _DJANGO_INSTRUMENTED = True
        except Exception as exc:  # pragma: no cover - defensive logging
            logger.warning(
                "Failed to instrument Django for OpenTelemetry.",
                extra={
                    "channel": "observability",
                    "event": "django_instrumentation_failed",
                    "error": str(exc),
                },
            )

    _TRACER_PROVIDER = tracer_provider

    atexit.register(shutdown_tracer)

    logger.info(
        "Backend APM instrumentation enabled.",
        extra={
            "channel": "observability",
            "event": "apm_initialized",
            "endpoint": endpoint,
            "service": service_name,
        },
    )

    return tracer_provider


def shutdown_tracer() -> None:
    """Shutdown OpenTelemetry tracers and processors."""

    global _TRACER_PROVIDER

    if _TRACER_PROVIDER is not None:
        if hasattr(_TRACER_PROVIDER, "shutdown"):
            try:
                _TRACER_PROVIDER.shutdown()
            except Exception as exc:  # pragma: no cover - defensive logging
                logger.warning(
                    "Error encountered while shutting down tracer provider.",
                    extra={
                        "channel": "observability",
                        "event": "apm_shutdown_failed",
                        "error": str(exc),
                    },
                )
        _TRACER_PROVIDER = None
