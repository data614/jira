# Python imports
import os

# Django imports
from django.conf import settings

# Module imports
from plane.license.models import InstanceConfiguration
from plane.license.utils.encryption import decrypt_data
from plane.license.utils.email_config import (
    DEFAULT_SMTP_PORT,
    EmailConfig,
    SendGridSettings,
    SENDGRID_DEFAULT_HOST,
    SENDGRID_DEFAULT_USERNAME,
    apply_sendgrid_overrides,
)


# Helper function to return value from the passed key
def get_configuration_value(keys):
    environment_list = []
    if settings.SKIP_ENV_VAR:
        # Get the configurations
        instance_configuration = InstanceConfiguration.objects.values(
            "key", "value", "is_encrypted"
        )

        for key in keys:
            for item in instance_configuration:
                if key.get("key") == item.get("key"):
                    if item.get("is_encrypted", False):
                        environment_list.append(decrypt_data(item.get("value")))
                    else:
                        environment_list.append(item.get("value"))

                    break
            else:
                environment_list.append(key.get("default"))
    else:
        # Get the configuration from os
        for key in keys:
            environment_list.append(os.environ.get(key.get("key"), key.get("default")))

    return tuple(environment_list)


def get_email_configuration():
    (
        email_host,
        email_host_user,
        email_host_password,
        email_port,
        email_use_tls,
        email_use_ssl,
        email_from,
        sendgrid_api_key,
        sendgrid_host,
        sendgrid_port,
        sendgrid_username,
        sendgrid_use_tls,
        sendgrid_use_ssl,
        sendgrid_from_email,
    ) = get_configuration_value(
        [
            {"key": "EMAIL_HOST", "default": os.environ.get("EMAIL_HOST")},
            {
                "key": "EMAIL_HOST_USER",
                "default": os.environ.get("EMAIL_HOST_USER"),
            },
            {
                "key": "EMAIL_HOST_PASSWORD",
                "default": os.environ.get("EMAIL_HOST_PASSWORD"),
            },
            {
                "key": "EMAIL_PORT",
                "default": os.environ.get("EMAIL_PORT", DEFAULT_SMTP_PORT),
            },
            {"key": "EMAIL_USE_TLS", "default": os.environ.get("EMAIL_USE_TLS", "1")},
            {"key": "EMAIL_USE_SSL", "default": os.environ.get("EMAIL_USE_SSL", "0")},
            {
                "key": "EMAIL_FROM",
                "default": os.environ.get(
                    "EMAIL_FROM", "Team Plane <team@mailer.plane.so>"
                ),
            },
            {
                "key": "SENDGRID_API_KEY",
                "default": os.environ.get("SENDGRID_API_KEY"),
            },
            {
                "key": "SENDGRID_SMTP_HOST",
                "default": os.environ.get(
                    "SENDGRID_SMTP_HOST", SENDGRID_DEFAULT_HOST
                ),
            },
            {
                "key": "SENDGRID_SMTP_PORT",
                "default": os.environ.get("SENDGRID_SMTP_PORT", DEFAULT_SMTP_PORT),
            },
            {
                "key": "SENDGRID_SMTP_USERNAME",
                "default": os.environ.get(
                    "SENDGRID_SMTP_USERNAME", SENDGRID_DEFAULT_USERNAME
                ),
            },
            {
                "key": "SENDGRID_SMTP_USE_TLS",
                "default": os.environ.get("SENDGRID_SMTP_USE_TLS", "1"),
            },
            {
                "key": "SENDGRID_SMTP_USE_SSL",
                "default": os.environ.get("SENDGRID_SMTP_USE_SSL", "0"),
            },
            {
                "key": "SENDGRID_FROM_EMAIL",
                "default": os.environ.get("SENDGRID_FROM_EMAIL"),
            },
        ]
    )

    base_config = EmailConfig(
        host=email_host,
        username=email_host_user,
        password=email_host_password,
        port=email_port,
        use_tls=email_use_tls,
        use_ssl=email_use_ssl,
        from_email=email_from,
    )

    sendgrid_settings = SendGridSettings(
        api_key=sendgrid_api_key,
        host=sendgrid_host,
        port=sendgrid_port,
        username=sendgrid_username,
        use_tls=sendgrid_use_tls,
        use_ssl=sendgrid_use_ssl,
        from_email=sendgrid_from_email,
    )

    resolved_config = apply_sendgrid_overrides(base_config, sendgrid_settings)
    return resolved_config.as_tuple()
