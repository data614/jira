import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

type LogLevel = "error" | "warn" | "info" | "http" | "debug";

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const LOG_COLORS: Record<LogLevel, string> = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

const NETLIFY_ENV_FLAGS = ["NETLIFY", "ENABLE_NETLIFY_LOGS", "PLANE_NETLIFY_LOGS"] as const;

const SPLAT_SYMBOL = Symbol.for("splat");

const isTruthy = (value: string | undefined | null | boolean): boolean => {
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

const shouldDisableFileLogs = (): boolean => {
  if (isTruthy(process.env.LOG_DISABLE_FILES)) return true;
  return NETLIFY_ENV_FLAGS.some((flag) => isTruthy(process.env[flag]));
};

const shouldUseJsonConsole = (): boolean => {
  const configuredFormat = process.env.LOG_FORMAT;
  if (typeof configuredFormat === "string" && configuredFormat.toLowerCase() === "json") {
    return true;
  }
  if (isTruthy(process.env.LOG_CONSOLE_JSON)) return true;
  return NETLIFY_ENV_FLAGS.some((flag) => isTruthy(process.env[flag]));
};

const safeSerialize = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value instanceof Error) {
    return JSON.stringify(
      {
        name: value.name,
        message: value.message,
        stack: value.stack,
      },
      undefined,
      0
    );
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const metadataFormatter = winston.format((info) => {
  const extras: unknown[] = [];
  const splat = (info as Record<string, unknown>)[SPLAT_SYMBOL as unknown as string];

  if (Array.isArray(splat)) {
    extras.push(...splat);
  }

  const shallowInfo = { ...info } as Record<string, unknown>;
  delete shallowInfo.level;
  delete shallowInfo.message;
  delete shallowInfo.timestamp;
  delete shallowInfo[SPLAT_SYMBOL as unknown as string];

  if (Object.keys(shallowInfo).length) {
    extras.push(shallowInfo);
  }

  return { ...info, metadata: extras };
});

const humanReadableFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  metadataFormatter,
  winston.format.printf((info: winston.Logform.TransformableInfo & { metadata?: unknown[] }) => {
    const metadata = Array.isArray(info.metadata) ? info.metadata : [];
    const metaString = metadata
      .map((item) => safeSerialize(item))
      .filter(Boolean)
      .join(" ");
    const suffix = metaString ? ` ${metaString}` : "";
    return `[${info.timestamp}] ${info.level}: ${info.message}${suffix}`;
  })
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: () => new Date().toISOString() }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  metadataFormatter,
  winston.format.uncolorize(),
  winston.format.printf((info: winston.Logform.TransformableInfo & { metadata?: unknown[] }) => {
    const payload: Record<string, unknown> = {
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
    };

    if (Array.isArray(info.metadata) && info.metadata.length) {
      payload.metadata = info.metadata.map((entry) => {
        if (entry instanceof Error) {
          return {
            name: entry.name,
            message: entry.message,
            stack: entry.stack,
          };
        }
        if (typeof entry === "object" && entry !== null) {
          return entry;
        }
        return safeSerialize(entry);
      });
    }

    return JSON.stringify(payload);
  })
);

winston.addColors(LOG_COLORS);

const transports = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || "info",
  }),
];

if (!shouldDisableFileLogs()) {
  transports.push(
    new DailyRotateFile({
      filename: path.join(process.cwd(), "logs", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || "20m",
      maxFiles: process.env.LOG_RETENTION || "7d",
      level: "error",
    })
  );

  transports.push(
    new DailyRotateFile({
      filename: path.join(process.cwd(), "logs", "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || "20m",
      maxFiles: process.env.LOG_RETENTION || "7d",
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: LOG_LEVELS,
  format: shouldUseJsonConsole() ? jsonFormat : humanReadableFormat,
  transports,
});
