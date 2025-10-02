'use strict';

var path = require('path');
var winston = require('winston');
var DailyRotateFile = require('winston-daily-rotate-file');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var path__default = /*#__PURE__*/_interopDefault(path);
var winston__default = /*#__PURE__*/_interopDefault(winston);
var DailyRotateFile__default = /*#__PURE__*/_interopDefault(DailyRotateFile);

// src/config.ts
var LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};
var LOG_COLORS = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white"
};
var NETLIFY_ENV_FLAGS = ["NETLIFY", "ENABLE_NETLIFY_LOGS", "PLANE_NETLIFY_LOGS"];
var SPLAT_SYMBOL = Symbol.for("splat");
var isTruthy = (value) => {
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
var shouldDisableFileLogs = () => {
  if (isTruthy(process.env.LOG_DISABLE_FILES)) return true;
  return NETLIFY_ENV_FLAGS.some((flag) => isTruthy(process.env[flag]));
};
var shouldUseJsonConsole = () => {
  const configuredFormat = process.env.LOG_FORMAT;
  if (typeof configuredFormat === "string" && configuredFormat.toLowerCase() === "json") {
    return true;
  }
  if (isTruthy(process.env.LOG_CONSOLE_JSON)) return true;
  return NETLIFY_ENV_FLAGS.some((flag) => isTruthy(process.env[flag]));
};
var safeSerialize = (value) => {
  if (typeof value === "string") return value;
  if (value instanceof Error) {
    return JSON.stringify(
      {
        name: value.name,
        message: value.message,
        stack: value.stack
      },
      void 0,
      0
    );
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};
var metadataFormatter = winston__default.default.format((info) => {
  const extras = [];
  const splat = info[SPLAT_SYMBOL];
  if (Array.isArray(splat)) {
    extras.push(...splat);
  }
  const shallowInfo = { ...info };
  delete shallowInfo.level;
  delete shallowInfo.message;
  delete shallowInfo.timestamp;
  delete shallowInfo[SPLAT_SYMBOL];
  if (Object.keys(shallowInfo).length) {
    extras.push(shallowInfo);
  }
  return { ...info, metadata: extras };
});
var humanReadableFormat = winston__default.default.format.combine(
  winston__default.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston__default.default.format.colorize({ all: true }),
  winston__default.default.format.errors({ stack: true }),
  winston__default.default.format.splat(),
  metadataFormatter,
  winston__default.default.format.printf((info) => {
    const metadata = Array.isArray(info.metadata) ? info.metadata : [];
    const metaString = metadata.map((item) => safeSerialize(item)).filter(Boolean).join(" ");
    const suffix = metaString ? ` ${metaString}` : "";
    return `[${info.timestamp}] ${info.level}: ${info.message}${suffix}`;
  })
);
var jsonFormat = winston__default.default.format.combine(
  winston__default.default.format.timestamp({ format: () => (/* @__PURE__ */ new Date()).toISOString() }),
  winston__default.default.format.errors({ stack: true }),
  winston__default.default.format.splat(),
  metadataFormatter,
  winston__default.default.format.uncolorize(),
  winston__default.default.format.printf((info) => {
    const payload = {
      timestamp: info.timestamp,
      level: info.level,
      message: info.message
    };
    if (Array.isArray(info.metadata) && info.metadata.length) {
      payload.metadata = info.metadata.map((entry) => {
        if (entry instanceof Error) {
          return {
            name: entry.name,
            message: entry.message,
            stack: entry.stack
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
winston__default.default.addColors(LOG_COLORS);
var transports = [
  new winston__default.default.transports.Console({
    level: process.env.LOG_LEVEL || "info"
  })
];
if (!shouldDisableFileLogs()) {
  transports.push(
    new DailyRotateFile__default.default({
      filename: path__default.default.join(process.cwd(), "logs", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || "20m",
      maxFiles: process.env.LOG_RETENTION || "7d",
      level: "error"
    })
  );
  transports.push(
    new DailyRotateFile__default.default({
      filename: path__default.default.join(process.cwd(), "logs", "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || "20m",
      maxFiles: process.env.LOG_RETENTION || "7d"
    })
  );
}
var logger = winston__default.default.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: LOG_LEVELS,
  format: shouldUseJsonConsole() ? jsonFormat : humanReadableFormat,
  transports
});

// src/middleware.ts
var requestLogger = (req, res, next) => {
  const startTime = Date.now();
  logger.http(`Incoming ${req.method} request to ${req.url} from ${req.ip}`);
  if (Object.keys(req.body).length > 0) {
    logger.debug("Request body:", req.body);
  }
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.http(`Completed ${req.method} ${req.url} with status ${res.statusCode} in ${duration}ms`);
  });
  next();
};

exports.logger = logger;
exports.requestLogger = requestLogger;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map