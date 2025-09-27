# Netlify Hosting Notes for the Plane Web Client

This guide documents the server-side behaviors defined in `apps/web/next.config.js` and the
local validation performed against the mocked/staging configuration.

## Local validation summary

To validate redirects and rewrites we ran the web workspace with staging-style environment
variables and a lightweight mock analytics server.

```bash
# from the repository root
python -m http.server 4002 &
NEXT_PUBLIC_API_BASE_URL=https://staging.api.plane.so \
NEXT_PUBLIC_API_BASE_PATH=/v1 \
NEXT_PUBLIC_POSTHOG_HOST=http://127.0.0.1:4002 \
NEXT_PUBLIC_ADMIN_BASE_URL=https://admin.staging.plane.so \
NEXT_PUBLIC_ADMIN_BASE_PATH=/god-mode \
NEXT_PUBLIC_SPACE_BASE_URL=https://space.staging.plane.so \
NEXT_PUBLIC_SPACE_BASE_PATH=/sites \
NEXT_PUBLIC_LIVE_BASE_URL=https://live.staging.plane.so \
NEXT_PUBLIC_LIVE_BASE_PATH=/app \
NEXT_PUBLIC_WEB_BASE_URL=http://localhost:3000 \
NEXT_PUBLIC_WEB_BASE_PATH=/ \
yarn workspace web dev
```

The development server started successfully at `http://localhost:3000`.【088539†L1-L7】【a48b3f†L1-L1】

### Redirect validation

| Request | Expected target | Result |
| ------- | --------------- | ------ |
| `GET /sign-in` | `/` (login page) | 308 redirect to `/sign-in/` followed by 308 redirect to `/` due to the global trailing slash setting.【707008†L1-L8】【64356e†L1-L8】 |
| `GET /login` | `/` (login page) | 308 redirect to `/login/` followed by 308 redirect to `/`.【103af6†L1-L8】【6c78f2†L1-L8】 |

### Rewrite validation

| Request | Destination | Result |
| ------- | ----------- | ------ |
| `GET /ingest/static/test.txt` | `${NEXT_PUBLIC_POSTHOG_HOST}/static/test.txt` | Proxied to the mock analytics server on port 4002, which returned the expected response headers from Python's `http.server`.【b6cc6c†L1-L21】【980467†L1-L5】 |

The mock analytics server was stopped after the checks completed.【980467†L1-L6】

## Netlify server-side feature requirements

Netlify must support the following Next.js server features for this application:

1. **Response headers** – Attach `X-Frame-Options: SAMEORIGIN` to every path via
   `async headers()` in `next.config.js`.【F:apps/web/next.config.js†L12-L18】
2. **Redirect matrix** – Preserve all permanent (308) redirects configured in
   `async redirects()` for legacy login URLs, workspace analytics routes, project settings
   paths, and intake inbox pages.【F:apps/web/next.config.js†L39-L78】 Because `trailingSlash`
   is enabled, Netlify should maintain chained redirects that normalize paths with and
   without the trailing slash.【F:apps/web/next.config.js†L7-L8】
3. **PostHog proxy rewrites** – Forward `/ingest/:path*` and `/ingest/static/:path*` requests
   to the analytics host defined by `NEXT_PUBLIC_POSTHOG_HOST`. This allows client-side
   analytics to operate without exposing the upstream host directly.【F:apps/web/next.config.js†L80-L96】
4. **Conditional admin console rewrites** – When `NEXT_PUBLIC_ADMIN_BASE_URL` or
   `NEXT_PUBLIC_ADMIN_BASE_PATH` is provided, proxy `/god-mode` requests to the corresponding
   admin application. Netlify's rewrite engine must be able to reference these environment
   variables at deploy time.【F:apps/web/next.config.js†L97-L115】
5. **Image delivery** – `images.unoptimized` is set to `true`, so Netlify can serve images
   directly without Next.js image optimization. No special image proxy is required.【F:apps/web/next.config.js†L19-L21】
6. **Standalone output** – The build output uses Next.js' `standalone` mode; Netlify must run
   the compiled server bundle (including middleware) produced by `next build` without
   modifications.【F:apps/web/next.config.js†L9-L11】
7. **Package import optimization** – The application relies on Next.js' SWC-based
   `optimizePackageImports` experiment. Deployments should pin the same Next.js version or
   verify compatibility when upgrading.【F:apps/web/next.config.js†L22-L38】

These capabilities ensure the Netlify runtime matches the behavior observed locally with the
mocked/staging configuration.
