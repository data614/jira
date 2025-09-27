# jira.goodhopecorp.com Go-Live and Operations Runbook

This playbook documents the production launch of Plane for the Good Hope Corp Jira replacement on `jira.goodhopecorp.com`. It reuses the shipping containers, API contracts, and user interface so the public experience mirrors every existing Plane deployment. The guidance covers environment preparation, rollout tasks, service-level objectives (SLOs), monitoring, and on-call expectations tuned for an enterprise-grade launch.

## 1. Architecture snapshot

Plane’s reference topology fits the Jira-branded rollout without altering interfaces. Each service maps directly to [`deploy/selfhost/docker-compose.yml`](../../deploy/selfhost/docker-compose.yml):

- **Customer-facing surfaces** &mdash; `web`, `space`, `admin`, and `live` publish the exact Next.js interfaces already in production. Set `NEXT_PUBLIC_API_BASE_URL` to the HTTPS API origin exposed by the proxy to keep URLs consistent.
- **Core API tier** &mdash; `api`, `worker`, `beat-worker`, and the ad-hoc `migrator` container share identical environment variables (`DATABASE_URL`, `REDIS_URL`, MinIO/S3 credentials, RabbitMQ URL). This preserves all REST and realtime behaviors used by current clients and automations.
- **Data plane** &mdash; PostgreSQL (`plane-db`), Valkey/Redis (`plane-redis`), RabbitMQ (`plane-mq`), and MinIO (`plane-minio`) retain their existing schemas and queues. Use managed services only if they maintain the same connection strings and failover guarantees.
- **Edge proxy** &mdash; `proxy` terminates TLS, enforces `APP_DOMAIN=jira.goodhopecorp.com`, and routes traffic across the frontend replicas without rewriting paths.

Teams preferring managed databases or object storage can swap the Compose definitions for those in [`deploy/cloud/docker-compose.managed.yml`](../../deploy/cloud/docker-compose.managed.yml) as long as environment variables stay aligned with the public interface.

## 2. Pre-go-live checklist

Complete the following before cutting traffic to `jira.goodhopecorp.com`:

1. **DNS** &mdash; Point `jira.goodhopecorp.com` at the load balancer or host running the Plane proxy. Honor existing TTLs so rollback is straightforward.
2. **TLS** &mdash; Issue certificates via Let’s Encrypt or the corporate CA. Set `SSL=true`, populate `CERT_EMAIL`, and configure ACME DNS values in the proxy block.
3. **Secrets** &mdash; Load all values defined in [`deploy/selfhost/variables.env`](../../deploy/selfhost/variables.env) into your secrets manager. Mirror staging credentials and rotate anything older than 90 days.
4. **Database** &mdash; Provision PostgreSQL 15+ with automated backups (hourly PITR + daily snapshot). Run migrations using `docker compose run --rm migrator` before exposing traffic.
5. **Cache and queue** &mdash; Validate Redis/Valkey and RabbitMQ credentials by running `python scripts/monitoring/service_healthcheck.py --fail-fast` against the production configuration.
6. **Object storage** &mdash; Confirm the uploads bucket exists, lifecycle policies meet compliance requirements, and encryption at rest is enabled.
7. **Synthetic monitoring** &mdash; Configure the health-check job (see §4) against staging. Switch the target host to production during cutover.
8. **Access controls** &mdash; Review SSO/OAuth setup for the Jira importer endpoints. Ensure SCIM or directory sync groups are mapped prior to go-live.

Document any deviations (custom ports, third-party integrations) so they can be replayed during incident response.

## 3. Deployment procedure

1. **Clone and configure**
   ```bash
   git clone git@github.com:goodhopecorp/plane.git
   cd plane
   cp deploy/selfhost/variables.env .env.production
   # Update .env.production with production secrets for jira.goodhopecorp.com
   ```
2. **Launch the stack**
   ```bash
   docker compose \
     -f deploy/selfhost/docker-compose.yml \
     --env-file .env.production \
     up -d --pull always
   ```
   For managed data services, substitute `deploy/cloud/docker-compose.managed.yml` while keeping environment variables identical.
3. **Run database migrations**
   ```bash
   docker compose \
     -f deploy/selfhost/docker-compose.yml \
     --env-file .env.production \
     run --rm migrator
   ```
4. **Smoke test**
   ```bash
   python scripts/monitoring/service_healthcheck.py --fail-fast
   ```
   Confirm `/api/health/` returns HTTP 200, the Jira importer wizard loads under Workspace Integrations, and authentication flows succeed end-to-end.
5. **Cut traffic**
   - Update the load balancer pool or DNS to direct production traffic.
   - Observe metrics (see §4) for at least 30 minutes before calling the launch complete.

To rollback, redeploy the previous Compose bundle and restore the latest PostgreSQL snapshot plus MinIO object versioning if files were uploaded.

## 4. Monitoring and alerting

Instrument the launch with layered observability:

- **Service health** &mdash; Schedule `scripts/monitoring/service_healthcheck.py --fail-fast` every minute from a runner inside the VPC. Alert after three consecutive failures or when dependency status != `healthy`.
- **Application telemetry** &mdash; Enable Sentry (`NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`) and PostHog (`NEXT_PUBLIC_POSTHOG_KEY`) so UI errors and performance trends appear in existing dashboards.
- **Importer traces** &mdash; Collect metrics from Jira importer endpoints (`/api/workspaces/<slug>/importers/jira`) to monitor OAuth failures, sync latency, and backlog depth.
- **Infrastructure metrics** &mdash; Stream CPU, memory, disk, and network telemetry from every container into the corporate observability stack. Set early-warning alerts at 75% utilization and hard alerts at 90%.
- **Log aggregation** &mdash; Forward structured logs (API, worker, proxy, Celery beat) to Splunk/Datadog with correlation IDs. Retain logs for 30 days to satisfy audit requirements.
- **Synthetic probes** &mdash; Configure uptime checks for `/api/health/`, `/auth/login/`, and the SPA routes most used by Jira import users. Include SLA-based latency thresholds (see §5).

## 5. Service-level objectives

Adopt the following SLOs for the first 90 days. Track error-budget burn weekly and pause feature releases if budgets fall below 25% remaining.

| Service | Metric | SLO | Measurement | Notes |
| --- | --- | --- | --- | --- |
| Web/API availability | Successful requests / total | 99.7% monthly | Load balancer + uptime probes | Error budget ~2h 10m downtime / 30 days. |
| API latency | 95th percentile response time | ≤ 700 ms | Proxy logs + APM traces | Measure authenticated `api/` requests. |
| Jira imports | Successful syncs / total | 99% monthly | Worker metrics + importer logs | Alert when queue backlog > 200 jobs or retries > 5%. |
| Background jobs | Task success rate | 99.5% monthly | Celery worker metrics | Focus on notification and automation queues. |
| Incident response | Time to acknowledge | ≤ 10 minutes | PagerDuty/Alertmanager timestamps | Applies to Sev1/Sev2. |

Any SLO breach requires an incident review, mitigation plan, and documented follow-up in the operational backlog.

## 6. On-call runbook

### 6.1 Roles and rotation

- **Primary engineer** &mdash; 24×7 pager coverage for the active week. Must join the incident bridge within 10 minutes.
- **Secondary engineer** &mdash; Escalation path if the primary has not acknowledged after 10 minutes or requires assistance.
- **Incident commander** &mdash; Assigned automatically for Sev1/Sev2 incidents to coordinate communications and approvals.
- **Comms lead** &mdash; Drafts status updates for stakeholders and customer-facing channels.

### 6.2 Severity matrix

| Severity | Criteria | Examples | Response |
| --- | --- | --- | --- |
| Sev1 | Complete outage, critical data loss, or security breach | 5xx > 50% for 5 min, failed login for all users, leaked credentials | Page primary + secondary immediately, open bridge, IC leads response. |
| Sev2 | Major degradation impacting many users | 5xx between 5–50%, importer backlog > 500 jobs, latency above SLO for 10 min | Page primary, secondary joins within 15 min, IC optional. |
| Sev3 | Minor degradation | Background retries increasing, single workspace importer failures | Notify via Slack, track in ops board. |
| Sev4 | Informational | Scheduled maintenance, early warning alerts | Document in status page, no page. |

### 6.3 Investigation workflow

1. **Acknowledge and announce** &mdash; Confirm the page, post in `#plane-ops`, and update the incident room template.
2. **Run health checks** &mdash; Execute `python scripts/monitoring/service_healthcheck.py --fail-fast` to identify failing dependencies.
3. **Review dashboards** &mdash; Check load balancer metrics, container resource graphs, APM traces, and PostHog/Sentry events.
4. **Inspect logs** &mdash; Filter API and worker logs by correlation ID, importer job ID, or recent deploy tag (`APP_RELEASE`).
5. **Mitigate**
   - Restart unhealthy services: `docker compose restart <service>`.
   - Scale horizontally if resources are constrained: `docker compose up -d --scale web=3 --scale worker=3`.
   - Rollback via `APP_RELEASE=<previous>` and rerun migrations if schema changes were deployed.
   - For importer-specific incidents, disable new Jira syncs by toggling the workspace integration flag until stable.
6. **Escalate** &mdash; Bring in the secondary engineer if mitigation exceeds 30 minutes. Notify security or compliance if incident touches regulated data.
7. **Communicate** &mdash; Provide updates every 15 minutes for Sev1/Sev2, every 30 minutes for Sev3, until resolved.

### 6.4 Post-incident

- File a retrospective within two business days capturing root cause, impact, mitigations, and follow-up actions.
- Update runbooks or automation scripts to prevent recurrence.
- Review SLO burn-down and adjust capacity plans if incidents approach error-budget limits.

## 7. Continuous improvement

- Schedule quarterly game days covering failover, certificate renewal, Jira importer edge cases, and database restore drills.
- Automate health checks and smoke tests in CI so regression risk stays low before future releases.
- Keep the runbook version-controlled; submit pull requests for every operational change to avoid drift and prevent merge conflicts.

Following this playbook keeps the `jira.goodhopecorp.com` deployment consistent with Plane’s existing interface while delivering enterprise-grade reliability, observability, and support readiness.
