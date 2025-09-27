# Backup, Storage, and Monitoring Runbook

This runbook captures the operational controls required to keep Plane's production data safe while preserving the application's existing interface and availability expectations. The controls below are additive—they extend the current deployment footprint without forcing schema changes or breaking API compatibility.

## Database backups

Plane's relational data lives in PostgreSQL. Protect it with the following workflow:

1. **Automate daily snapshots**
   - Schedule a full-cluster `pg_dump` (logical backup) during your lowest-traffic window. Store the compressed archive in a secure, versioned object store bucket.
   - Complement the logical dump with the managed snapshots provided by your hosting platform (e.g., AWS RDS automated snapshots). Retain at least 7 days of daily snapshots and 4 weekly snapshots for disaster recovery.
2. **Encrypt and isolate backup artifacts**
   - Enable server-side encryption with customer-managed keys (CMKs) when writing to S3-compatible storage.
   - Restrict bucket access to the backup automation role and a limited restoration role; do not expose backups to the general application runtime.
3. **Replicate to a secondary region**
   - Configure cross-region replication for the backup bucket to a geographically distant region. This mitigates regional outages and satisfies enterprise continuity requirements.
4. **Test restoration quarterly**
   - Rehydrate a staging PostgreSQL instance from the most recent snapshot at least once per quarter.
   - Run the Django migrations and smoke tests to validate the restored database keeps the application interface unchanged.
5. **Monitor backup jobs**
   - Emit logs and metrics from the backup scheduler (cron job, Airflow DAG, or managed service) to your observability stack.
   - Alert on missing backups (no success event in 26 hours) and failed restore tests.

## Object storage lifecycle policies

Plane stores file uploads and rich assets in object storage. Apply lifecycle policies that balance cost control and compliance without deleting active data.

1. **Segregate buckets by environment and data type**
   - Use dedicated buckets such as `plane-prod-attachments` and `plane-prod-exports` to simplify retention policies.
   - Enable bucket versioning to protect against accidental deletions while keeping compatibility with the existing upload interface.
2. **Define lifecycle transitions**
   - Keep new objects in the `Standard` storage class for the first 30 days to optimize access speed for in-flight projects.
   - Transition objects older than 30 days to an infrequent-access tier (e.g., S3 Standard-IA) and objects older than 180 days to a cold-storage tier (e.g., S3 Glacier Flexible Retrieval).
   - Expire object versions that are older than 365 days if they are noncurrent, retaining the latest version indefinitely unless legal holds require otherwise.
3. **Enforce data retention and compliance**
   - Apply object locks or retention policies for workspaces subject to regulatory requirements (HIPAA, SOC 2). The lifecycle rules above coexist with these controls.
   - Enable access logging and integrate with your SIEM to detect anomalous download spikes.
4. **Validate lifecycle behavior**
   - Quarterly, sample objects across storage classes to confirm transitions and retrieval times meet service-level objectives.

## Monitoring and alerting

The application already ships with a service health check script. Extend observability with the following practices:

1. **Service availability probes**
   - Schedule `python scripts/monitoring/service_healthcheck.py --format=json` to run every five minutes from a trusted runner.
   - Push the structured output to your monitoring system (Datadog, Prometheus, or CloudWatch) and alert when any dependency reports `status != "healthy"`.
2. **Application performance monitoring (APM)**
   - Instrument the Django API and Next.js client with OpenTelemetry exporters or your chosen APM. Capture request latency, error rates, and key business transactions.
   - Feed frontend telemetry to PostHog using the existing integration while ensuring personally identifiable information (PII) masking policies are applied.
3. **Log aggregation**
   - Ship container logs to a centralized platform (ELK, Loki) with structured JSON fields. Index by tenant, environment, and service to accelerate incident response.
4. **Alert review cadence**
   - Maintain an on-call rotation that triages alerts within 15 minutes.
   - Review noise levels monthly, tuning thresholds so genuine regressions surface without overwhelming responders.

## Change management

- Track every modification to backup or lifecycle automation in source control (IaC repositories, Terraform modules, or Ansible playbooks).
- Require peer review before promoting changes, reducing the risk of unexpected behavior in production.
- Document incidents and remediation steps in Plane issues so context persists across teams.

By adhering to this runbook, you achieve enterprise-grade resilience: daily PostgreSQL snapshots, cost-effective object storage, and proactive monitoring—all while keeping Plane's public interface stable for end users.
