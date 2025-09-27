# Web workspace build audit

This document captures the current Turborepo topology for the `apps/web` workspace
and how `yarn turbo run build` behaves when targeting the web client.

## Build command and outputs

- **Build task**: `next build`
- **Workspace directory**: `apps/web`
- **Framework detected by Turborepo**: Next.js
- **Declared build outputs**: `.next/**`, `dist/**`
- **Global environment variables**: `NODE_ENV`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_ADMIN_BASE_URL`, `NEXT_PUBLIC_ADMIN_BASE_PATH`, `NEXT_PUBLIC_SPACE_BASE_URL`, `NEXT_PUBLIC_SPACE_BASE_PATH`, `NEXT_PUBLIC_WEB_BASE_URL`, `NEXT_PUBLIC_LIVE_BASE_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_CRISP_ID`, `NEXT_PUBLIC_ENABLE_SESSION_RECORDER`, `NEXT_PUBLIC_SESSION_RECORDER_KEY`, `NEXT_PUBLIC_EXTRA_IMAGE_DOMAINS`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_POSTHOG_DEBUG`, `NEXT_PUBLIC_SUPPORT_EMAIL`

The values above are sourced directly from `turbo.json` and are injected into all
workspaces participating in the build pipeline.

## Dependent workspace builds

A Turborepo dry run shows that the `web` build depends on the following internal
packages (all invoked with their `build` task):

- `@plane/constants`
- `@plane/editor`
- `@plane/eslint-config`
- `@plane/hooks`
- `@plane/i18n`
- `@plane/propel`
- `@plane/services`
- `@plane/tailwind-config`
- `@plane/types`
- `@plane/typescript-config`
- `@plane/ui`
- `@plane/utils`

Each dependency is executed before `apps/web` runs `next build`, ensuring the web
client always consumes the latest compiled assets from the shared packages.

## Confirming the build graph

Run the included audit script to inspect the Turborepo plan without executing the
actual builds:

```bash
node scripts/web-build-audit.mjs
```

The script shells out to `turbo run build --filter=web --dry-run=json`, parses the
resulting JSON, and prints a summary of the command, outputs, dependency tree, and
global environment requirements. This makes it safe to monitor the build graph in
automation without triggering expensive Next.js builds.

To execute the full build, use:

```bash
yarn turbo run build --filter=web
```

The dry-run output confirms the command above will execute the shared package
`build` tasks listed earlier before building the web client itself.
