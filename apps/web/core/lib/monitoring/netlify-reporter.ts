"use client";

import { type NormalizedError, stringifyUnknown } from "@/lib/monitoring/error-normalizer";

type NetlifyLogLevel = "debug" | "info" | "warn" | "error";
type NetlifyLogKind = "error" | "metric" | "lifecycle";

type NetlifyClientEventBase = {
  kind: NetlifyLogKind;
  name: string;
  level?: NetlifyLogLevel;
  message?: string;
  context?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  timestamp?: string;
};

type NetlifyClientErrorEvent = NetlifyClientEventBase & {
  kind: "error";
  error: NormalizedError;
  source: string;
};

type NetlifyClientMetricEvent = NetlifyClientEventBase & {
  kind: "metric";
  metric: string;
};

type NetlifyClientLifecycleEvent = NetlifyClientEventBase & {
  kind: "lifecycle";
};

type NetlifyClientEvent =
  | NetlifyClientErrorEvent
  | NetlifyClientMetricEvent
  | NetlifyClientLifecycleEvent;

const LOG_ENDPOINT = "/api/monitoring/log";
const MAX_BODY_LENGTH = 40_000;

const truthy = (value: string | boolean | undefined | null): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  switch (value.toLowerCase()) {
    case "1":
    case "true":
    case "yes":
    case "on":
      return true;
    default:
      return false;
  }
};

const resolveLoggingEnabled = (): boolean => {
  const envFlag =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_ENABLE_NETLIFY_LOGS ?? process.env.NEXT_PUBLIC_ENABLE_CLIENT_LOGS
      : undefined;

  if (truthy(envFlag)) return true;

  const globalScope = globalThis as typeof globalThis & {
    __PLANE_ENABLE_NETLIFY_LOGS__?: boolean;
  };

  return truthy(globalScope.__PLANE_ENABLE_NETLIFY_LOGS__);
};

const isLoggingEnabled = resolveLoggingEnabled();

const truncateString = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}…`;
};

const safePayload = (payload: Record<string, unknown> | undefined): Record<string, unknown> | undefined => {
  if (!payload) return undefined;
  const result: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(payload)) {
    if (typeof raw === "string") {
      result[key] = truncateString(raw, 2048);
    } else if (Array.isArray(raw)) {
      result[key] = raw.slice(0, 20).map((item) => {
        if (typeof item === "string") return truncateString(item, 1024);
        if (typeof item === "number" || typeof item === "boolean" || item === null) {
          return item;
        }
        if (typeof item === "object" && item !== null) {
          try {
            return JSON.parse(JSON.stringify(item));
          } catch {
            return stringifyUnknown(item);
          }
        }
        return stringifyUnknown(item);
      });
    } else if (typeof raw === "object" && raw !== null) {
      try {
        result[key] = JSON.parse(JSON.stringify(raw));
      } catch {
        result[key] = stringifyUnknown(raw);
      }
    } else {
      result[key] = raw;
    }
  }
  return result;
};

const serializeError = (error: NormalizedError): Record<string, unknown> => ({
  name: error.name,
  message: truncateString(error.message, 2048),
  stack: error.stack ? truncateString(error.stack, 4096) : undefined,
  cause:
    typeof error.cause === "string"
      ? truncateString(error.cause, 1024)
      : error.cause
        ? truncateString(stringifyUnknown(error.cause), 1024)
        : undefined,
});

const buildRequestBody = (event: NetlifyClientEvent): string | undefined => {
  if (!isLoggingEnabled) return undefined;

  const timestamp = event.timestamp ?? new Date().toISOString();
  const base: Record<string, unknown> = {
    kind: event.kind,
    name: event.name,
    level: event.level ?? (event.kind === "error" ? "error" : "info"),
    timestamp,
    runtime: "browser",
  };

  if (event.message) base.message = truncateString(event.message, 2048);
  if (event.context) base.context = safePayload(event.context);
  if (event.payload) base.payload = safePayload(event.payload);

  if (event.kind === "error") {
    base.error = serializeError(event.error);
    base.source = event.source;
  }

  if (event.kind === "metric") {
    base.metric = event.metric;
  }

  const serialized = JSON.stringify(base);
  if (serialized.length > MAX_BODY_LENGTH) {
    return JSON.stringify({
      ...base,
      truncated: true,
    });
  }

  return serialized;
};

const sendBeacon = (body: string) => {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(LOG_ENDPOINT, blob);
      return;
    }
  } catch (error) {
    // Ignore sendBeacon failures and fall back to fetch
  }

  if (typeof fetch === "function") {
    fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      cache: "no-store",
    }).catch(() => {
      // Swallow fetch errors; logging should be fire-and-forget
    });
  }
};

const dispatchEvent = (event: NetlifyClientEvent) => {
  const body = buildRequestBody(event);
  if (!body) return;
  sendBeacon(body);
};

export const reportNetlifyClientError = (
  name: string,
  params: {
    error: NormalizedError;
    context?: Record<string, unknown>;
    payload?: Record<string, unknown>;
    source: string;
  }
) => {
  dispatchEvent({
    kind: "error",
    name,
    error: params.error,
    context: params.context,
    payload: params.payload,
    source: params.source,
  });
};

export const reportNetlifyClientMetric = (
  metric: string,
  payload: Record<string, unknown>,
  context?: Record<string, unknown>
) => {
  dispatchEvent({
    kind: "metric",
    name: `metric:${metric}`,
    metric,
    payload,
    context,
  });
};

export const reportNetlifyLifecycleEvent = (
  name: string,
  payload?: Record<string, unknown>,
  level: NetlifyLogLevel = "info"
) => {
  dispatchEvent({
    kind: "lifecycle",
    name,
    payload,
    level,
  });
};
