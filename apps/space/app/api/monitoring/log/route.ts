import { NextResponse } from "next/server";
import { logger } from "@plane/logger";

export const runtime = "nodejs";

interface MonitoringPayload {
  timestamp?: string;
  source?: string;
  error?: {
    name?: string;
    message: string;
    stack?: string;
    cause?: unknown;
  };
  context?: Record<string, unknown>;
}

const sanitizePayload = (payload: MonitoringPayload) => {
  const { error, context, source, timestamp } = payload;
  return {
    timestamp: timestamp || new Date().toISOString(),
    source: source || "unknown",
    error: {
      name: error?.name,
      message: error?.message || "Unknown client error",
      stack: error?.stack,
      cause: error?.cause,
    },
    context: context || {},
  };
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as MonitoringPayload;
    const sanitized = sanitizePayload(payload);

    logger.error(
      `[client-monitoring] source=${sanitized.source} message="${sanitized.error.message}" context=${JSON.stringify(
        sanitized.context
      )}`
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error(`[client-monitoring] Failed to record client error: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ error: "Invalid monitoring payload" }, { status: 400 });
  }
}
