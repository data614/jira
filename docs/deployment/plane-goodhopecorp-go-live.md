# plane.goodhopecorp.com Go-Live and Operations Runbook

This document captures the production launch plan for the Plane stack on `plane.goodhopecorp.com`, including environment preparation, deployment steps, service-level objectives (SLOs), monitoring, and on-call expectations. The guidance preserves the public interface of the Plane applications (`web`, `space`, `admin`, and `live`) so the rollout stays consistent with existing deployments.

## 1. Architecture snapshot

Plane’s standard container topology remains unchanged for the Good Hope Corp rollout. Each component maps to the images and environment contracts defined in [`deploy/selfhost/docker-compose.yml`](../../deploy/selfhost/docker-compose.yml):

- **Frontend surfaces**: `web`, `space`, `admin`, and `live` containers published behind the Plane proxy. All rely on `NEXT_PUBLIC_API_BASE_URL` pointing at the HTTPS API endpoint.
- **Core services**: `api`, `worker`, and `beat-worker` share identical environment blocks (`DATABASE_URL`, `REDIS_URL`, S3/MinIO variables, RabbitMQ credentials) to ensure application parity with existing instances.
- **Data plane**: PostgreSQL (`plane-db`), Valkey/Redis (`plane-redis`), RabbitMQ (`plane-mq`), and MinIO/S3 storage follow the reference configuration with dedicated volumes for persistence.
- **Edge proxy**: The `proxy` service terminates TLS, enforces the `APP_DOMAIN`, and distributes traffic across frontend containers without altering HTTP interfaces.

Teams that prefer managed data services can swap in the managed Compose variant documented in [`deploy/cloud/docker-compose.managed.yml`](../../deploy/cloud/docker-compose.managed.yml) without modifying the user-facing routes.

## 2. Pre-go-live checklist

Complete the following prerequisites before promoting `plane.goodhopecorp.com` to production:

1. **DNS**: Create an `A`/`AAAA` record pointing `plane.goodhopecorp.com` at the load balancer or host that runs the Plane proxy.
2. **TLS certificates**: Issue a certificate via Let’s Encrypt or the corporate CA. Set `SSL=true`, populate `CERT_EMAIL`, and configure ACME DNS values in the proxy environment block.
3. **Secrets**: Populate the variables defined in [`deploy/selfhost/variables.env`](../../deploy/selfhost/variables.env) (database credentials, storage keys, third-party integrations) in your secrets manager.
4. **Database readiness**: Provision PostgreSQL 15+ with the same schema as staging. Run migrations using `./bin/docker-entrypoint-migrator.sh` prior to cutover.
5. **Cache and queue**: Ensure Redis/Valkey and RabbitMQ endpoints are reachable with authentication matching the Compose defaults.
6. **Object storage**: Confirm MinIO or an S3-compatible bucket is accessible; pre-create the uploads bucket if required.
7. **Synthetic monitoring**: Configure the health-check job (see §4) to run against the staging environment; this becomes production smoke testing after cutover.

Document any deviations from the defaults (ports, credentials) so the team can replay the configuration.

## 3. Deployment procedure

1. **Clone and configure**
   ```bash
   git clone git@github.com:goodhopecorp/plane.git
   cd plane
   cp deploy/selfhost/variables.env .env.production
   # Edit .env.production with production secrets
   ```
2. **Launch the stack**
   ```bash
   docker compose \
     -f deploy/selfhost/docker-compose.yml \
     --env-file .env.production \
     up -d --pull always
   ```
   For managed data services, replace the Compose file with `deploy/cloud/docker-compose.managed.yml`.
3. **Run database migrations**
   ```bash
   docker compose \
     -f deploy/selfhost/docker-compose.yml \
     --env-file .env.production \
     run --rm migrator
   ```
4. **Validate health**
   ```bash
   python scripts/monitoring/service_healthcheck.py --fail-fast
   ```
   Confirm `/api/health/` returns HTTP 200 and that frontend surfaces load over HTTPS.
5. **Flip traffic**
   - Update the load balancer or DNS TTL to direct production traffic.
   - Monitor metrics (see §4) for at least 30 minutes before declaring success.

Rollback by redeploying the previous Compose bundle and restoring from the most recent database snapshot.

## 4. Monitoring and alerting setup

The production stack must emit logs, metrics, and traces to enterprise observability tooling:

- **Service health**: Schedule `scripts/monitoring/service_healthcheck.py` every minute from a runner in the same VPC. Alert on consecutive failures or degraded dependency status (`status != healthy`).
- **Application telemetry**: Enable PostHog (`NEXT_PUBLIC_POSTHOG_KEY`) and Sentry (`NEXT_PUBLIC_SENTRY_DSN`) so client-side errors and performance data flow into centralized dashboards.
- **Infrastructure metrics**: Collect CPU, memory, disk, and network metrics from each container. Set alerting thresholds at 75% of known capacity to pre-empt saturation.
- **Log aggregation**: Forward container logs (API, worker, proxy) to the corporate log pipeline (e.g., Splunk, Datadog). Index by correlation ID to simplify incident response.
- **Synthetic checks**: Maintain uptime probes targeting `/api/health/`, `/auth/login/`, and key SPA routes. Alert when three consecutive probes fail or exceed latency SLO thresholds.

## 5. Service-level objectives

The Good Hope Corp production environment adopts the following SLOs, aligned with Plane’s reference workloads:

| Service | Metric | SLO | Measurement | Notes |
| --- | --- | --- | --- | --- |
| Web/API availability | Successful requests / total | 99.5% monthly | Uptime probe + load balancer metrics | Error budget of 3h 39m downtime per 30-day window. |
| API latency | 95th percentile response time | ≤ 800 ms | Reverse proxy and APM traces | Measure on authenticated requests to `/api/`. |
| Background jobs | Task success rate | 99% monthly | Celery worker metrics | Track via worker logs and RabbitMQ queue depth. |
| Incident response | Time to acknowledge | ≤ 15 minutes | Pager duty timestamps | Applies to Sev1/Sev2 incidents. |

Breaching any SLO requires an incident review and remediation plan. Track error-budget consumption weekly and pause feature launches if the budget falls below 25% remaining.

## 6. On-call runbook

### 6.1 Roles and schedule

- **Primary engineer**: Receives pager alerts 24×7 during assigned rotation week.
- **Secondary engineer**: Provides backup coverage; escalations occur after 15 minutes without acknowledgement.
- **Incident commander**: Appointed during Sev1 events to coordinate response and communication.

### 6.2 Severity matrix

| Severity | Criteria | Examples | Response |
| --- | --- | --- | --- |
| Sev1 | Complete outage or critical data loss | 5xx > 50% for 5 min, data corruption | Page primary immediately; start bridge call. |
| Sev2 | Partial outage or major degradation | 5xx 5–50%, latency above SLO for 10 min | Page primary; secondary joins within 30 min. |
| Sev3 | Minor degradation | Background queue backlog, intermittent errors | Notify via Slack; monitor closely. |

### 6.3 Investigation workflow

1. **Acknowledge alert** and notify stakeholders in `#plane-ops` Slack.
2. **Check health command**: `python scripts/monitoring/service_healthcheck.py --fail-fast` to isolate failing dependencies.
3. **Review dashboards**: Load balancer metrics, container CPU/memory, and PostHog/Sentry error trends.
4. **Inspect logs**: Filter API and worker logs for correlation IDs or recent deploy IDs.
5. **Mitigate**:
   - Restart unhealthy containers: `docker compose restart <service>`.
   - Scale out if resources are constrained: `docker compose up -d --scale web=3`.
   - Rollback by redeploying the previous image tag (`APP_RELEASE=<prior>`).
6. **Escalate** to the secondary engineer if no mitigation within 30 minutes; involve incident commander for Sev1/Sev2.
7. **Communicate** status updates every 15 minutes to stakeholders until resolved.

### 6.4 Post-incident

- File a retrospective within two business days summarizing impact, root cause, and follow-up actions.
- Update this runbook with any new remediation steps or automation opportunities.

## 7. Continuous improvement

- Schedule quarterly game days to rehearse failover, certificate renewal, and database restore procedures.
- Automate dependency checks and smoke tests as part of the CI/CD pipeline so regressions are caught pre-deploy.
- Track operational metrics (alert frequency, MTTR, error-budget burn) to refine SLO targets and staffing.

Maintaining these practices ensures `plane.goodhopecorp.com` launches smoothly, remains enterprise-grade, and retains interface compatibility with the broader Plane ecosystem.
