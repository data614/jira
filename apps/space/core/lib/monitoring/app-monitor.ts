"use client";

type ErrorContext = Record<string, unknown>;

type NormalizedError = {
  name?: string;
  message: string;
  stack?: string;
  cause?: unknown;
};

type EventSource = "error" | "unhandledrejection" | "manual";

const DEDUPLICATION_WINDOW = 10_000; // 10 seconds

const stringifyUnknown = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const normalizeError = (error: unknown): NormalizedError => {
  if (error instanceof Error) {
    const normalized: NormalizedError = {
      name: error.name,
      message: error.message,
      stack: error.stack ?? undefined,
    };
    if ((error as { cause?: unknown }).cause) {
      normalized.cause = stringifyUnknown((error as { cause?: unknown }).cause);
    }
    return normalized;
  }

  if (typeof error === "string") {
    return { message: error };
  }

  if (typeof error === "object" && error !== null) {
    const serialized = stringifyUnknown(error);
    return { message: serialized };
  }

  return { message: String(error) };
};

const resolveKey = (error: NormalizedError): string => {
  const stackFragment = error.stack ? error.stack.split("\n")[0] : "";
  return [error.name ?? "Error", error.message, stackFragment].filter(Boolean).join(":");
};

const buildRuntimeContext = (): ErrorContext => {
  if (typeof window === "undefined") return {};

  const { location, navigator } = window;
  return {
    url: location?.href,
    pathname: location?.pathname,
    search: location?.search,
    hash: location?.hash,
    userAgent: navigator?.userAgent,
    language: navigator?.language,
    platform: navigator?.platform,
    online: navigator?.onLine,
  };
};

const sendErrorReport = (source: EventSource, normalizedError: NormalizedError, context?: ErrorContext) => {
  if (typeof window === "undefined") return;

  const payload = {
    timestamp: new Date().toISOString(),
    source,
    error: normalizedError,
    context: {
      ...buildRuntimeContext(),
      ...context,
    },
  };

  try {
    const body = JSON.stringify(payload);
    if (navigator?.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/monitoring/log", blob);
      return;
    }

    void fetch("/api/monitoring/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch (error) {
    console.error("[app-monitor] Failed to report error", error);
  }
};

export class AppMonitor {
  private started = false;
  private removeListeners: Array<() => void> = [];
  private recentErrors = new Map<string, number>();

  start(): void {
    if (this.started) return;
    this.started = true;

    if (typeof window === "undefined") {
      return;
    }

    const handleError = (event: ErrorEvent) => {
      const normalized = normalizeError(event.error || event.message || "Unknown runtime error");
      if (!this.shouldReport(normalized)) return;

      sendErrorReport("error", normalized, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: event.type,
        isTrusted: event.isTrusted,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const normalized = normalizeError(event.reason || "Unhandled rejection");
      if (!this.shouldReport(normalized)) return;

      sendErrorReport("unhandledrejection", normalized, {
        type: event.type,
        isTrusted: event.isTrusted,
      });
    };

    window.addEventListener("error", handleError);
    this.removeListeners.push(() => window.removeEventListener("error", handleError));

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    this.removeListeners.push(() =>
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    );
  }

  stop(): void {
    if (!this.started) return;

    while (this.removeListeners.length) {
      const remove = this.removeListeners.pop();
      try {
        remove?.();
      } catch (error) {
        console.error("[app-monitor] Failed to remove listener", error);
      }
    }

    this.started = false;
  }

  captureException(error: unknown, context?: ErrorContext): void {
    const normalized = normalizeError(error);
    if (!this.shouldReport(normalized)) return;

    sendErrorReport("manual", normalized, context);
  }

  private shouldReport(error: NormalizedError): boolean {
    const key = resolveKey(error);
    const now = Date.now();
    const lastTimestamp = this.recentErrors.get(key) ?? 0;

    for (const [storedKey, timestamp] of this.recentErrors.entries()) {
      if (now - timestamp > DEDUPLICATION_WINDOW) {
        this.recentErrors.delete(storedKey);
      }
    }

    if (now - lastTimestamp < DEDUPLICATION_WINDOW) {
      return false;
    }

    this.recentErrors.set(key, now);
    return true;
  }
}

export const appMonitor = new AppMonitor();
