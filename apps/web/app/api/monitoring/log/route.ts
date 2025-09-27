import { NextRequest, NextResponse } from "next/server";

import { logger } from "@plane/logger";

type LogLevel = "debug" | "info" | "warn" | "error";
type EventKind = "error" | "metric" | "lifecycle";

type ObservabilityPayload = {
  kind?: EventKind;
  name?: string;
  level?: LogLevel;
  message?: string;
  metric?: string;
  source?: string;
  runtime?: string;
  timestamp?: string;
  context?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  error?: Record<string, unknown>;
  truncated?: boolean;
};

const MAX_BODY_LENGTH = 60_000;
const MAX_STRING_LENGTH = 4096;
const MAX_ARRAY_ITEMS = 25;
const MAX_OBJECT_KEYS = 40;

const truthy = (value: string | undefined | null | boolean): boolean => {
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

const isLoggingEnabled = (): boolean => {
  const explicit = process.env.ENABLE_NETLIFY_LOGS ?? process.env.PLANE_NETLIFY_LOGS;
  if (truthy(explicit)) return true;
  if (truthy(process.env.NETLIFY)) return true;
  return false;
};

const sanitizeString = (value: unknown, limit = MAX_STRING_LENGTH): string | undefined => {
  if (typeof value !== "string") return undefined;
  if (value.length <= limit) return value;
  return `${value.slice(0, limit)}…`;
};

const sanitizeUnknown = (value: unknown, depth = 0): unknown => {
  if (depth > 3) return "[max-depth-exceeded]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return sanitizeString(value) ?? "";
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizeUnknown(item, depth + 1));
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_OBJECT_KEYS);
    const result: Record<string, unknown> = {};
    for (const [key, raw] of entries) {
      result[key] = sanitizeUnknown(raw, depth + 1);
    }
    return result;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
};

const sanitizeRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (!value || typeof value !== "object") return undefined;
  return sanitizeUnknown(value) as Record<string, unknown>;
};

const parseLevel = (input: unknown, kind: EventKind | undefined): LogLevel => {
  const normalized = typeof input === "string" ? input.toLowerCase() : undefined;
  if (normalized === "debug" || normalized === "info" || normalized === "warn" || normalized === "error") {
    return normalized;
  }
  if (kind === "error") return "error";
  return "info";
};

const parseKind = (value: unknown): EventKind | undefined => {
  if (value === "error" || value === "metric" || value === "lifecycle") return value;
  return undefined;
};

const readPayload = async (request: NextRequest): Promise<ObservabilityPayload | undefined> => {
  const raw = await request.text();
  if (!raw) return undefined;

  const trimmed = raw.length > MAX_BODY_LENGTH ? raw.slice(0, MAX_BODY_LENGTH) : raw;

  try {
    return JSON.parse(trimmed) as ObservabilityPayload;
  } catch (error) {
    logger.warn("Failed to parse observability payload", {
      channel: "observability",
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
};

const buildLogContext = (
  request: NextRequest,
  payload: ObservabilityPayload
): Record<string, unknown> => {
  const headers = request.headers;
  return {
    event_kind: payload.kind,
    event_name: payload.name,
    event_metric: payload.metric,
    runtime: payload.runtime,
    timestamp: payload.timestamp,
    context: sanitizeRecord(payload.context),
    payload: sanitizeRecord(payload.payload),
    error: sanitizeRecord(payload.error),
    truncated: payload.truncated,
    request_id:
      headers.get("x-nf-request-id") ??
      headers.get("x-amzn-trace-id") ??
      headers.get("x-request-id"),
    user_agent: headers.get("user-agent"),
    forwarded_for: headers.get("x-forwarded-for"),
    source: payload.source,
  };
};

export async function POST(request: NextRequest): Promise<Response> {
  const body = await readPayload(request);

  if (!body) {
    return new Response(null, { status: 204 });
  }

  if (!isLoggingEnabled()) {
    return new Response(null, { status: 204 });
  }

  const kind = parseKind(body.kind);
  const level = parseLevel(body.level, kind);

  const message = body.message ??
    (kind ? `Client ${kind} event` : "Client observability event");

  logger.log(level, message, buildLogContext(request, body));

  return NextResponse.json({ status: "ok" }, { status: 200 });
}

export const runtime = "nodejs";
