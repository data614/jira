#!/bin/bash
set -euo pipefail

python manage.py wait_for_db
python manage.py wait_for_migrations

exec celery -A plane beat -l info
