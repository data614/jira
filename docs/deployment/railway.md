# Railway Deployment Blueprint for the Django API

This guide walks through deploying the Plane Django API to [Railway](https://railway.app/) with managed PostgreSQL, Redis, and RabbitMQ instances. It relies exclusively on the repository's production Dockerfile (`apps/api/Dockerfile.api`) and requirements so the runtime stays aligned with the existing interface.

## 1. Prerequisites

- Railway account with the Docker plugin enabled (Pro plan recommended for private networking).
- Local Docker installation for building and testing images before pushing to Railway.
- Access to provisioned PostgreSQL, Redis, and RabbitMQ services. Railway provides first-party templates for all three components.
- A copy of the Plane repository with access to the `deploy/` utilities and `.env` secrets you intend to use in production.

## 2. Provision backing services

Create three Railway services using the "New" button in the project dashboard:

1. **PostgreSQL** – choose the managed PostgreSQL template and note the connection URL.
2. **Redis** – select the Redis template with TLS enabled and copy the `REDIS_URL`.
3. **RabbitMQ** – add the RabbitMQ template (or import credentials from CloudAMQP if you prefer). Capture the AMQP connection string.

Label the services clearly (for example `plane-postgres`, `plane-redis`, and `plane-rabbitmq`) so they are easy to reference in variables and metrics.

## 3. Prepare environment variables

The Django API expects the following variables in Railway:

| Variable | Source | Notes |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL service | Railway injects a `DATABASE_URL` secret automatically. Promote it to the Plane service. |
| `REDIS_URL` | Redis service | Use the TLS URL for encrypted transport. |
| `CELERY_BROKER_URL` | RabbitMQ service | Use the AMQP URL provided by Railway or CloudAMQP. |
| `SECRET_KEY` | Custom | Generate a long random string. |
| `ALLOWED_HOSTS` | Custom | Comma-separated Railway domains. |
| `WEB_URL` | Custom | Public URL of the frontend if applicable. |
| `AWS_*` variables | Existing | Reuse your current S3 or MinIO credentials. |
| Other Plane settings | Existing | Copy from `deploy/selfhost/variables.env` as needed. |

Railway lets you map variables from one service to another. Add the `DATABASE_URL`, `REDIS_URL`, and `CELERY_BROKER_URL` variables as shared variables so they stay in sync with regenerated credentials.

## 4. Add the Docker workload

1. From the project dashboard, click **New → Service** and pick **Deploy from GitHub repo**.
2. Select the repository and branch that contains your Plane deployment assets.
3. When prompted for the deploy directory, choose `apps/api` so Railway picks up `Dockerfile.api`.
4. Set the start command to `./bin/docker-entrypoint-api.sh` (already included in the image).
5. Configure the following service settings:
   - **Port**: 8000 (Railway will map it automatically to HTTPS).
   - **Health Check Path**: `/api/health/` (or another existing health endpoint).
   - **Root Directory**: `apps/api`.
   - **Build Arguments**: none required—the Dockerfile reads from `requirements.txt`.

Railway builds the image with the same `pip` dependencies and static file compilation defined in `apps/api/Dockerfile.api`, ensuring behaviour parity with local Compose deployments.

## 5. Add background workers

Plane requires Celery workers and beat schedulers. Create two additional Railway services that reuse the same repository:

- **Celery worker**
  - Start command: `./bin/docker-entrypoint-worker.sh`
  - Variables: share the same set used by the API container.
- **Celery beat**
  - Start command: `./bin/docker-entrypoint-beat.sh`
  - Variables: identical to the worker.

Both services will build from `Dockerfile.api`, so no extra Docker configuration is necessary.

## 6. Run database migrations

After the first deployment, open the API service shell in Railway and run:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

Alternatively, add a temporary service using the migrator entry point (`./bin/docker-entrypoint-migrator.sh`) and delete it once migrations complete.

## 7. Validate with the health monitor

Use the new management command introduced in this repository to confirm external dependencies are reachable:

```bash
python manage.py monitor_services --timeout 10
```

Successful output shows `database`, `redis`, and `rabbitmq` marked as `HEALTHY`. Errors surface immediately, making it easy to diagnose missing environment variables or networking issues.

For automated monitoring, package the helper script `scripts/monitoring/service_healthcheck.py` into a Railway "Cron" job or run it from an external observer such as GitHub Actions.

## 8. Observability and alerting

- **Logs**: Stream logs from each Railway service to your observability stack (Datadog, Grafana, or Elastic). Railway exposes a Log Drain integration for shipping logs securely.
- **Metrics**: Enable Railway's metrics dashboards and set alerts on CPU, memory, and restart counts. Match thresholds to your current on-premise baselines.
- **Synthetic checks**: Pair the `/api/health/` endpoint with a third-party uptime monitor (PagerDuty, Checkly) to detect regressions before users do.
- **Celery tasks**: Inspect the `django_celery_beat_periodictask` table or the worker logs to ensure scheduled jobs run as expected.

## 9. Rollback plan

1. Keep your existing deployment active until Railway passes integration tests.
2. Tag Docker images with semantic versions so you can redeploy a known-good build quickly.
3. Snapshot the PostgreSQL database before major migrations using Railway's backup tools.
4. Export Redis data (or rely on snapshotting) if you store non-ephemeral information.
5. Record RabbitMQ user credentials in a secure password manager to speed up environment recreation.

Following this blueprint delivers an enterprise-ready deployment on Railway without altering Plane's public interface. All infrastructure changes live beside the codebase so they can be peer reviewed and version controlled.
