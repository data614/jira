# Netlify Deployment Guide

This guide explains how to connect the Plane repository to Netlify, configure the build to use the Next.js web application, and supply the runtime environment variables Netlify needs in production. Follow the checklist before enabling automatic deployments so that the connection is stable and reproducible.

## 1. Connect the GitHub repository

1. Sign in to Netlify and choose **Add new site → Import an existing project**.
2. Select **GitHub** as the Git provider and authorize Netlify if this is the first time.
3. Pick the Plane repository (`plane-software/plane` or the fork you maintain) from the repository list.
4. Leave the deploy configuration screen open for the next steps; do not trigger the first build yet.

> ℹ️ **Tip:** If Netlify cannot locate the repository, verify that the GitHub account you authorized has at least `Read` access and that third-party application restrictions are disabled for the organization.

## 2. Set the base directory to the Next.js app

The Plane monorepo hosts multiple applications. Netlify must build the Next.js web client located at `apps/web`.

1. In the **Basic build settings**, set the **Base directory** field to `apps/web`.
2. Netlify automatically prefixes subsequent paths with this base, so the default **Build command** `yarn build` and **Publish directory** `.next` work without additional changes.
3. Ensure the repository contains a lockfile (`yarn.lock`) so that Netlify respects the workspace dependency graph during installation.

## 3. Pin the Node.js runtime to v18+

Plane’s web application targets Node.js 18. Set the version explicitly so that future Netlify upgrades do not break the build.

1. Scroll to the **Environment variables** section.
2. Add a variable named `NODE_VERSION` with the value `18` (or a more recent LTS release such as `18.19.1`).
3. Alternatively, add an `.nvmrc` file at the repository root containing `18`, but keeping the Netlify variable ensures the runtime stays in sync with the CI matrix.

## 4. Supply required environment variables

Plane reads configuration at build time and runtime. At minimum provide the following variables in Netlify:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Points the web client to the Plane API instance. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Enables product analytics and monitoring. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Override if you self-host PostHog. |
| `NEXT_PUBLIC_INTERCOM_APP_ID` | Required when Intercom is enabled. |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional but recommended for additional error observability. |
| `PLANE_CLOUD` | Set to `true` when deploying the managed Plane Cloud experience. |

> 📌 **Recommendation:** Store secrets in Netlify’s **Shared environment variables** UI so all deploy contexts (production, preview, branch) inherit the same configuration. Override per-context values only when absolutely necessary.

## 5. Trigger the initial build

1. Click **Save** after entering the environment variables.
2. Start the first deploy. Netlify installs dependencies from the root `package.json`, runs `yarn build` inside `apps/web`, and publishes the `.next` output directory.
3. Verify the deployment log includes `Next.js`, `Turbo`, and `PostHog` initialization to confirm the monitoring hooks (including the App Monitor) are active.

## 6. Monitor deployments

* Enable Netlify’s **Deploy notifications** so the team is alerted to regressions.
* Pair Netlify deploys with the `scripts/monitoring/service_healthcheck.py` helper from this repository to validate backend dependencies before promoting a build.
* The enhanced client-side monitoring added to the App Monitor automatically records performance metrics (navigation timing, Largest Contentful Paint, and more) in PostHog, helping you correlate Netlify releases with end-user impact.

By following this procedure, you ensure Netlify builds the correct workspace with the expected runtime, reducing merge conflicts and configuration drift between environments.
