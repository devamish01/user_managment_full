import pino from "pino";
import { env } from "@/config/index.js";

const isProduction = env.NODE_ENV === "production";

const loggerConfig = {
  level: isProduction ? "info" : "debug",
};

if (!isProduction) {
  Object.assign(loggerConfig, {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  });
}

export const logger = pino(loggerConfig);