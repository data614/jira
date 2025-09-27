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
      ])
    );
  };

  const handleUncaughtException = (error: Error) => {
    const normalized = normalizeError(error);
    logger.error(
      formatMessage("Uncaught exception detected.", [
        describeNormalizedError(normalized),
      ])
    );
  };

  const handleWarning = (warning: Error) => {
    const normalized = normalizeError(warning);
    logger.warn(
      formatMessage("Process warning emitted.", [describeNormalizedError(normalized)])
    );
  };

  const handleRejectionHandled = (promise: Promise<unknown>) => {
    if (typeof logger.debug === "function") {
      logger.debug(
        formatMessage("Promise rejection handled after being reported.", [
          `promise=${stringifyUnknown(promise)}`,
        ])
      );
    }
  };

  process.on("unhandledRejection", handleUnhandledRejection);
  process.on("uncaughtException", handleUncaughtException);
  process.on("warning", handleWarning);
  process.on("rejectionHandled", handleRejectionHandled);

  logger.info("Server monitoring hooks registered for Plane Web.");
}
