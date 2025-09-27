import { logger } from "@plane/logger";

import {
  describeNormalizedError,
  normalizeError,
  stringifyUnknown,
} from "@/lib/monitoring/error-normalizer";

const REGISTERED_KEY = Symbol.for("plane.web.monitoring.registered");

type GlobalWithMonitoring = typeof globalThis & {
  [REGISTERED_KEY]?: boolean;
};

const globalScope = globalThis as GlobalWithMonitoring;

const markAsRegistered = () => {
  Object.defineProperty(globalScope, REGISTERED_KEY, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
  });
};

const isRegistered = () => Boolean(globalScope[REGISTERED_KEY]);

const formatMessage = (title: string, details: string[]) =>
  [title, ...details.filter(Boolean)].join(" ");

export async function register(): Promise<void> {
  if (isRegistered()) {
    return;
  }

  markAsRegistered();

  const handleUnhandledRejection = (reason: unknown) => {
    const normalized = normalizeError(reason);
    logger.error(
      formatMessage("Unhandled promise rejection detected.", [
        describeNormalizedError(normalized),
      ]),
      {
        channel: "server.monitoring",
        event: "unhandled_rejection",
        normalized_error: normalized,
      }
    );
  };

  const handleUncaughtException = (error: Error) => {
    const normalized = normalizeError(error);
    logger.error(
      formatMessage("Uncaught exception detected.", [
        describeNormalizedError(normalized),
      ]),
      {
        channel: "server.monitoring",
        event: "uncaught_exception",
        normalized_error: normalized,
      }
    );
  };

  const handleWarning = (warning: Error) => {
    const normalized = normalizeError(warning);
    logger.warn(
      formatMessage("Process warning emitted.", [describeNormalizedError(normalized)]),
      {
        channel: "server.monitoring",
        event: "process_warning",
        normalized_error: normalized,
      }
    );
  };

  const handleRejectionHandled = (promise: Promise<unknown>) => {
    if (typeof logger.debug === "function") {
      logger.debug(
        formatMessage("Promise rejection handled after being reported.", [
          `promise=${stringifyUnknown(promise)}`,
        ]),
        {
          channel: "server.monitoring",
          event: "rejection_handled",
        }
      );
    }
  };

  process.on("unhandledRejection", handleUnhandledRejection);
  process.on("uncaughtException", handleUncaughtException);
  process.on("warning", handleWarning);
  process.on("rejectionHandled", handleRejectionHandled);

  logger.info("Server monitoring hooks registered for Plane Web.", {
    channel: "server.monitoring",
    event: "monitoring_registered",
  });
}
