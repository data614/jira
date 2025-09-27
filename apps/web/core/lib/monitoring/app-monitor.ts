"use client";

import { captureError, captureSuccess } from "@/helpers/event-tracker.helper";
import { type NormalizedError, normalizeError } from "@/lib/monitoring/error-normalizer";
import { PerformanceMetricsCollector, type PerformanceMetricReporter } from "./performance-metrics";

type ErrorContext = Record<string, unknown>;
type EventSource = "error" | "unhandledrejection" | "manual";

const DEDUPLICATION_WINDOW = 10_000; // 10 seconds
const LONG_TASK_THRESHOLD = 200; // milliseconds

const stringifyUnknown = (v: unknown): string => {
  try {
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.stack || v.message || String(v);
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
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
  private restoreConsole?: () => void;
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

    // Extra instrumentation
    this.installConsoleInterceptors();
    this.installLongTaskObserver();

    this.performanceCollector.start();
  }

  stop(): void {
    if (!this.started) return;

    try {
      this.performanceCollector.stop();
    } catch {
      // ignore
    }

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

  private installConsoleInterceptors(): void {
    if (this.restoreConsole) return;

    const globalConsole = console;
    const originalError = globalConsole.error.bind(globalConsole);
    const originalWarn = globalConsole.warn.bind(globalConsole);

    const intercept = (level: "error" | "warn", original: (...args: unknown[]) => void) =>
      (...args: unknown[]) => {
        try {
          original(...args);
        } finally {
          const serialized = args.map(stringifyUnknown).join(" ");
          if (!serialized) return;

          const label = level === "error" ? "Console error" : "Console warning";
          this.captureException(new Error(`${label}: ${serialized}`), {
            channel: "console",
            level,
          });
        }
      };

    globalConsole.error = intercept("error", originalError);
    globalConsole.warn = intercept("warn", originalWarn);

    this.restoreConsole = () => {
      globalConsole.error = originalError;
      globalConsole.warn = originalWarn;
      this.restoreConsole = undefined;
    };

    this.removeListeners.push(() => {
      try {
        this.restoreConsole?.();
      } catch {
        // Ignore restoration issues
      }
    });
  }

  private installLongTaskObserver(): void {
    if (typeof window === "undefined") return;
    if (typeof PerformanceObserver === "undefined") return;

    let observer: PerformanceObserver | undefined;

    try {
      observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType !== "longtask") continue;
          const duration = entry.duration;
          if (duration < LONG_TASK_THRESHOLD) continue;

          this.captureException(`Long task detected (${Math.round(duration)}ms)`, {
            channel: "performance",
            entryType: entry.entryType,
            name: entry.name,
            duration,
            startTime: entry.startTime,
            threshold: LONG_TASK_THRESHOLD,
          });
        }
      });

      observer.observe({ entryTypes: ["longtask"] });
    } catch (error) {
      this.captureException(error, {
        channel: "performance_observer",
        entryType: "longtask",
        action: "observe",
      });
      observer?.disconnect();
      return;
    }

    this.removeListeners.push(() => {
      try {
        observer?.disconnect();
      } catch (error) {
        this.captureException(error, {
          channel: "performance_observer",
          entryType: "longtask",
          action: "disconnect",
        });
      }
    });
  }
}

export const appMonitor = new AppMonitor();
