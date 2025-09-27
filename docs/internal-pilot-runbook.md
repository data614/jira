# Internal Pilot Runbook

This runbook orchestrates a 5–10 user internal pilot without changing Plane's user-facing interface. It stitches together the
existing operations, monitoring, and feedback tooling that already ships with the repository so the trial reflects the current
product experience.

## 1. Goals & Success Criteria

- Validate that Plane's current workflows satisfy internal stakeholders (product, engineering, customer success) without UI
  changes.
- Capture qualitative and quantitative feedback to prioritize fixes before a wider launch.
- Confirm observability coverage using the shipping monitoring stack (Django service checks, App Monitor, PostHog analytics).

Success looks like: pilot participants complete their core weekly tasks, all incidents are triaged within SLA, and a prioritized
backlog of improvements is ready for the next milestone.

## 2. Pre-flight Checklist

1. **Stabilize the environment**
   - Run `python manage.py migrate` followed by `python manage.py monitor_services --timeout 10` to confirm PostgreSQL, Redis, and
     RabbitMQ are reachable with the current configuration.
   - Schedule `scripts/monitoring/service_healthcheck.py` as a cron job or GitHub Action to capture structured logs if a
     dependency fails between manual checks.
2. **Seed representative data**
   - Import anonymized tickets or duplicate an existing project space so that the pilot mirrors production data models.
   - Verify that automations, webhooks, and integrations are disabled unless required for the pilot cohort.
3. **Enable observability hooks**
   - Confirm the Next.js workspace loads with App Monitor enabled so client errors and performance metrics continue flowing to
     PostHog.
   - Review API logs to ensure `monitoring_service.run_checks()` is available at `/api/monitoring/public/` for synthetic health
     probes.

## 3. User Cohort & Access Provisioning

1. Nominate 5–10 internal users across disciplines who exercise different parts of the Plane interface.
2. Provision access using existing role mappings—no new permission model changes are required for the pilot.
3. Send a kickoff brief covering:
   - Scope (features in/out)
   - Expected time investment (e.g., 2 sprints)
   - Feedback channels and SLA for responses

## 4. Feedback Collection Loops

- **Asynchronous**: Create a dedicated project in Plane tagged `pilot-feedback` so participants can log issues without changing
  their daily workflow. Triagers can convert items into bugs or feature requests as needed.
- **Synchronous**: Host a midpoint and retro session. Export dashboards or burndown charts directly from the existing analytics
  views to anchor the discussion.
- **Survey**: At pilot completion, send a lightweight form (CSAT, NPS, task-level friction points) and store results in Plane's
  Docs or an external sheet linked from the project.

## 5. Monitoring & Incident Response

1. **Real-time monitoring**
   - Review the App Monitor stream (client performance + errors) in PostHog for spikes after feature usage.
   - Track collaborative editing events via `apps/live` metrics—`monitoringService` already records connection counts and
     incidents exposed by `/api/monitoring/log`.
2. **Scheduled checks**
   - Keep the `monitor_services` management command in a scheduled job (every 5 minutes) alongside the healthcheck helper to
     catch infrastructure regressions.
   - Use `/api/monitoring/public/` with a third-party uptime monitor (Checkly, Grafana, etc.) for external visibility.
3. **Incident playbook**
   - When an alert fires, triage in the dedicated pilot project, tagging with severity and assigning an owner.
   - Leverage existing logging (Django, Next.js, Hocuspocus server) before escalating. No code changes are required—focus on log
     correlation and root cause analysis.

## 6. Exit & Rollout Decision

1. Consolidate feedback tickets and survey results into themes.
2. Categorize follow-up work: **must-fix before GA**, **scheduled for roadmap**, or **decline with rationale**.
3. Draft the pilot report summarizing adoption metrics, open issues, and recommendations for the broader launch.
4. Present findings to leadership and obtain sign-off before extending the rollout beyond the initial 5–10 users.

By following this runbook you can execute the internal pilot using Plane's existing capabilities, minimizing risk of merge
conflicts or interface drift while still capturing enterprise-grade operational telemetry.
