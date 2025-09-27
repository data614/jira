"use client";

export type PerformanceMetricReporter = (
  metric: string,
  payload: Record<string, unknown>
) => void;

type LargestContentfulPaintEntry = PerformanceEntry & {
  id?: string;
  size?: number;
  url?: string;
  element?: Element | null;
  renderTime?: number;
  loadTime?: number;
};

type LayoutShiftEntry = PerformanceEntry & {
  value?: number;
  hadRecentInput?: boolean;
};

type FirstInputEntry = PerformanceEntry & {
  processingStart?: number;
  cancelable?: boolean;
  target?: EventTarget | null;
  interactionId?: number;
};

type LongTaskAttribution = {
  name?: string;
  entryType?: string;
  startTime?: number;
  duration?: number;
  containerType?: string;
  containerName?: string;
  containerId?: string;
  containerSrc?: string;
};

type LongTaskEntry = PerformanceEntry & {
  attribution?: LongTaskAttribution[];
};

type ResourceErrorTarget =
  | HTMLImageElement
  | HTMLScriptElement
  | HTMLLinkElement
  | HTMLVideoElement
  | HTMLSourceElement
  | SVGImageElement;

const LONG_TASK_THRESHOLD_MS = 50;
const MAX_HTML_SNAPSHOT_LENGTH = 512;

export class PerformanceMetricsCollector {
  private observers: PerformanceObserver[] = [];
  private cleanupCallbacks: Array<() => void> = [];
  private started = false;
  private layoutShiftScore = 0;
  private lastLcpEntry: LargestContentfulPaintEntry | undefined;

  constructor(private readonly report: PerformanceMetricReporter) {}

  start(): void {
    if (this.started) return;
    if (typeof window === "undefined" || typeof performance === "undefined") return;
    this.started = true;

    this.captureNavigationTiming();
    this.observePaintTimings();
    this.observeLargestContentfulPaint();
    this.observeLayoutShift();
    this.observeLongTasks();
    this.observeFirstInputDelay();
    this.observeResourceFailures();
  }

  stop(): void {
    if (!this.started) return;

    this.flushLargestContentfulPaint("stop");

    while (this.cleanupCallbacks.length) {
      const remove = this.cleanupCallbacks.pop();
      try {
        remove?.();
      } catch (error) {
        // Swallow cleanup errors to avoid interfering with app shutdown
      }
    }

    for (const observer of this.observers) {
      try {
        observer.disconnect();
      } catch (error) {
        // Ignore observer cleanup failures
      }
    }

    this.observers = [];
    this.layoutShiftScore = 0;
    this.lastLcpEntry = undefined;
    this.started = false;
  }

  private addCleanup(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  private tryObserve(type: string, callback: (entry: PerformanceEntry) => void): void {
    if (typeof PerformanceObserver === "undefined") return;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });
      observer.observe({ type: type as any, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      // Ignore unsupported entry types in current runtime
    }
  }

  private captureNavigationTiming(): void {
    const navigationEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (!navigationEntries.length) return;

    const [navigation] = navigationEntries;
    this.report("navigation", {
      duration: navigation.duration,
      domInteractive: navigation.domInteractive,
      domContentLoaded: navigation.domContentLoadedEventEnd,
      domComplete: navigation.domComplete,
      responseEnd: navigation.responseEnd,
      transferSize: navigation.transferSize,
      encodedBodySize: navigation.encodedBodySize,
      decodedBodySize: navigation.decodedBodySize,
      type: navigation.type,
      redirectCount: navigation.redirectCount,
    });
  }

  private observePaintTimings(): void {
    this.tryObserve("paint", (entry) => {
      if (entry.name === "first-paint" || entry.name === "first-contentful-paint") {
        this.report(entry.name, {
          startTime: entry.startTime,
          duration: entry.duration,
        });
      }
    });
  }

  private observeLargestContentfulPaint(): void {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        this.flushLargestContentfulPaint("visibilitychange");
      }
    };

    const handlePageHide = () => {
      this.flushLargestContentfulPaint("pagehide");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    this.addCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    this.addCleanup(() => window.removeEventListener("pagehide", handlePageHide));

    this.tryObserve("largest-contentful-paint", (entry) => {
      this.lastLcpEntry = entry as LargestContentfulPaintEntry;
    });
  }

  private flushLargestContentfulPaint(trigger: string): void {
    if (!this.lastLcpEntry) return;

    const entry = this.lastLcpEntry;
    const renderTime = entry.renderTime ?? entry.loadTime ?? entry.startTime;
    const element = entry.element ?? undefined;

    this.report("largest_contentful_paint", {
      trigger,
      value: renderTime,
      size: entry.size,
      id: entry.id,
      url: entry.url,
      tagName: element instanceof Element ? element.tagName : undefined,
    });

    this.lastLcpEntry = undefined;
  }

  private observeLayoutShift(): void {
    this.tryObserve("layout-shift", (entry) => {
      const layoutEntry = entry as LayoutShiftEntry;
      if (layoutEntry.hadRecentInput) return;

      const delta = layoutEntry.value ?? 0;
      if (delta <= 0) return;

      this.layoutShiftScore += delta;
      this.report("cumulative_layout_shift", {
        delta,
        value: this.layoutShiftScore,
        startTime: entry.startTime,
      });
    });
  }

  private observeLongTasks(): void {
    this.tryObserve("longtask", (entry) => {
      if (entry.duration < LONG_TASK_THRESHOLD_MS) return;

      const longTask = entry as LongTaskEntry;
      this.report("long_task", {
        duration: entry.duration,
        startTime: entry.startTime,
        name: entry.name,
        attribution: longTask.attribution?.map((item) => ({
          name: item.name,
          entryType: item.entryType,
          startTime: item.startTime,
          duration: item.duration,
          containerType: item.containerType,
          containerName: item.containerName,
          containerId: item.containerId,
          containerSrc: item.containerSrc,
        })),
      });
    });
  }

  private observeFirstInputDelay(): void {
    this.tryObserve("first-input", (entry) => {
      const firstInput = entry as FirstInputEntry;
      const processingStart = firstInput.processingStart ?? 0;
      const delay = processingStart > 0 ? processingStart - entry.startTime : 0;

      this.report("first_input_delay", {
        name: entry.name,
        delay,
        duration: entry.duration,
        startTime: entry.startTime,
        cancelable: firstInput.cancelable,
        interactionId: firstInput.interactionId,
      });
    });
  }

  private observeResourceFailures(): void {
    const handleResourceError = (event: Event) => {
      if (event instanceof ErrorEvent) return;

      const target = event.target as ResourceErrorTarget | null;
      if (!target || !(target instanceof Element)) return;

      let url: string | undefined;
      if (target instanceof HTMLImageElement || target instanceof HTMLVideoElement) {
        url = target.currentSrc || target.src || undefined;
      } else if (target instanceof HTMLSourceElement) {
        url = target.src;
      } else if (target instanceof HTMLScriptElement) {
        url = target.src;
      } else if (target instanceof HTMLLinkElement) {
        url = target.href;
      } else if (typeof SVGImageElement !== "undefined" && target instanceof SVGImageElement) {
        url = target.href?.baseVal;
      }

      this.report("resource_error", {
        tagName: target.tagName,
        url,
        outerHTML: typeof target.outerHTML === "string" ? target.outerHTML.slice(0, MAX_HTML_SNAPSHOT_LENGTH) : undefined,
      });
    };

    window.addEventListener("error", handleResourceError, true);
    this.addCleanup(() => window.removeEventListener("error", handleResourceError, true));
  }
}
