# Cloud Deployment Guide

This guide provides a reference architecture for deploying Plane with managed data services (Neon Postgres and Upstash Redis) and a container runtime (Render or Railway) while keeping the existing product interface unchanged. All configuration is additive, so you can introduce it without conflicting with ongoing self-hosted work.

## Overview

The recommended topology keeps the Plane application stack in Docker Compose while delegating stateful services to managed providers:

- **Database**: Neon serverless Postgres
- **Cache / Queue**: Upstash Redis
- **Application Runtime**: Render or Railway hosting a Docker Compose workload
- **Object Storage**: Continue using the S3-compatible bucket already configured in your environment (no change needed for compatibility).

The Compose definition exposes the same ports, environment variables, and container names that the self-hosted bundle uses to guarantee interface parity.

## Prerequisites

1. Plane repository cloned with access to `deploy/` assets.
2. Docker and Docker Compose plugin available locally for build and testing.
3. Accounts created at [Neon](https://neon.tech/), [Upstash](https://upstash.com/), and either [Render](https://render.com/) or [Railway](https://railway.app/).
4. Existing Plane `.env` secrets stored in a secure secret manager (Render/Railway environment variables, or a GitHub Actions secret for automation).

## Step 1 – Provision managed services

### Neon Postgres

1. Create a new project and database branch.
2. Set the region closest to your application runtime.
3. Copy the Postgres connection string in the "psql" format.
4. Enforce connection pooling (pgBouncer) with the same database, user, and password values used locally.

### Upstash Redis

1. Create a new Redis database.
2. Select the serverless plan that matches your load profile.
3. Copy the REST URL, REST token, and TLS-enabled Redis URL.
4. Enable multi-region replication if you expect a globally distributed workload.

Store these secrets securely for later use as Compose environment variables.

## Step 2 – Prepare the Docker Compose workload

A dedicated Compose file keeps settings aligned with the published self-host bundle while externalizing data stores. See [`docker-compose.managed.yml`](./docker-compose.managed.yml) for the reference configuration. Key updates:

- Removes bundled Postgres and Redis containers.
- Injects Neon/Upstash URLs through environment variables (`DATABASE_URL`, `REDIS_URL`, `REDIS_REST_URL`, `REDIS_REST_TOKEN`).
- Adds health checks so Render/Railway can monitor service status.
- Sets `NEXT_PUBLIC_API_BASE_URL` dynamically so the frontend calls the API over HTTPS without manual overrides.

You can validate the configuration locally:

```bash
docker compose -f deploy/cloud/docker-compose.managed.yml --env-file deploy/selfhost/variables.env up --build
```

Stop the stack with `docker compose ... down` when finished.

## Step 3 – Deploy on Render

1. Create a new **Blueprint** service.
2. Point Render to your repository and select the `deploy/cloud` directory as the blueprint root.
3. Set the following environment variables in the Render dashboard (use Neon/Upstash values):
   - `DATABASE_URL`
   - `REDIS_URL`
   - `REDIS_REST_URL`
   - `REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_API_BASE_URL` (defaults to `https://<APP_DOMAIN>` when `SSL=true`)
   - Any other secrets listed in `deploy/selfhost/variables.env`
4. Enable auto-deploy on git push and configure health checks:
   - HTTP health check on `https://<your-domain>/api/health/`
   - Background worker health checks rely on Compose `healthcheck` definitions.

Render will build the Docker images using the provided Dockerfile contexts. Keep an eye on the Render Activity feed for build logs.

## Step 4 – Deploy on Railway

Railway offers a similar flow using the Compose plugin:

1. Install the Railway CLI and log in: `npm i -g @railway/cli && railway login`.
2. Initialize a new project with Docker support: `railway init --plugins docker`.
3. Push the Compose file: `railway up --service plane --docker-compose deploy/cloud/docker-compose.managed.yml`.
4. Set the required environment variables in the Railway dashboard or via `railway variables set`.
5. Configure metrics and logging in Railway's observability tab for ongoing monitoring.

## Step 5 – Monitor and alert

Monitoring on Render or Railway relies on provider integrations:

- **Metrics**: Enable CPU, memory, and response-time dashboards. Set thresholds based on your current self-hosted utilization.
- **Logs**: Stream application logs to a centralized destination (Render Log Streams, Railway Observability, or an external provider like Datadog).
- **Health checks**: Ensure the `/api/health/` endpoint returns HTTP 200. Compose health checks restart unhealthy containers automatically.
- **Alerts**: Configure alerts for deploy failures, container restarts, and sustained high latency. Both Render and Railway support Slack, email, and webhook notifications.

For deeper application monitoring, integrate OpenTelemetry exporters already available in the Plane stack. Point them to your observability backend (Tempo, Honeycomb, etc.) by extending environment variables in the Compose file.

## Rollback plan

1. Keep the existing self-hosted stack running until the managed deployment passes all checks.
2. Use database branching in Neon to revert to a previous snapshot if a migration fails.
3. Enable Redis persistence in Upstash and clone the database to recover from cache corruption.
4. Maintain a backup copy of `docker-compose.managed.yml` and `.env` secrets in version control with restricted access.

## Next steps

- Automate migrations using Render/Railway deployment hooks (`./deploy/selfhost/install.sh migrate`).
- Add synthetic monitoring via Checkly or Grafana Cloud to detect regressions.
- Update runbooks with the new managed-service topology.

Following this process gives you enterprise-grade reliability while keeping the Plane interface and behaviour untouched.
