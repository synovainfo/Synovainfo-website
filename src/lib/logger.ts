import pino from "pino";
import { v4 as uuidv4 } from "uuid";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "body.password",
      "body.token",
    ],
    censor: "[REDACTED]",
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      requestId: req.requestId,
      ip: req.ip,
    }),
    err: pino.stdSerializers.err,
  },
});

export function createChildLogger(module: string) {
  return logger.child({ module });
}

export function createRequestLogger(requestId?: string) {
  return logger.child({ requestId: requestId || uuidv4() });
}
