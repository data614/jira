"use client";

import { captureError, captureSuccess } from "@/helpers/event-tracker.helper";
import { type NormalizedError, normalizeError } from "@/lib/monitoring/error-normalizer";
import { PerformanceMetricsCollector, type PerformanceMetricReporter } from "./performance-metrics";

type ErrorContext = Record<string, unknown>;
type EventSource = "error" | "unhandledrejection" | "manual";

const DEDUPLICATION_WINDOW = 10_000; // 10 seconds

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

const reportThroughAnalytics = (
  source: EventSource,
  normalizedError: NormalizedError,
  context?: ErrorContext
) => {
  captureError({
    eventName: "app_monitor_error",
    error: normalizedError,
    payload: { severity: "critical", origin: source },
    context: { ...buildRuntimeContext(), ...context },
  });
};

const reportPerformanceMetric: PerformanceMetricReporter = (metric, payload) => {
  captureSuccess({
    eventName: "app_monitor_performance",
    payload: { metric, ...payload },
    context: buildRuntimeContext(),
  });
};

export class AppMonitor {
  private started = false;
  private removeListeners: Array<() => void> = [];
  private recentErrors = new Map<string, number>();
  private performanceCollector = new PerformanceMetricsCollector(reportPerformanceMetric);

  start(): void {
    if (this.started) return;
    this.started = true;
    if (typeof window === "undefined") return;

    const handleError = (event: ErrorEvent) => {
      const normalized = normalizeError(event.error || event.message || "Unknown runtime error");
      if (!this.shouldReport(normalized)) return;
      reportThroughAnalytics("error", normalized, {
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
      reportThroughAnalytics("unhandledrejection", normalized, {
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

    this.performanceCollector.start();
  }

  stop(): void {
    if (!this.started) return;

    this.performanceCollector.stop();

    while (this.removeListeners.length) {
      const remove = this.removeListeners.pop();
      try {
        remove?.();
      } catch {
        // ignore
      }
    }
    this.started = false;
  }

  captureException(error: unknown, context?: ErrorContext): void {
    const normalized = normalizeError(error);
    if (!this.shouldReport(normalized)) return;
    reportThroughAnalytics("manual", normalized, context);
  }

  private shouldReport(error: NormalizedError): boolean {
    const key = resolveKey(error);
    const now = Date.now();
    const last = this.recentErrors.get(key) ?? 0;

    // purge old entries
    for (const [k, ts] of this.recentErrors.entries()) {
      if (now - ts > DEDUPLICATION_WINDOW) this.recentErrors.delete(k);
    }

    if (now - last < DEDUPLICATION_WINDOW) return false;
    this.recentErrors.set(key, now);
    return true;
  }
}

export const appMonitor = new AppMonitor();
