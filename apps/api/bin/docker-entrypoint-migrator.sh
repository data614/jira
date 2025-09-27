#!/bin/bash
set -euo pipefail

python manage.py wait_for_db "$@"

exec python manage.py migrate "$@"
