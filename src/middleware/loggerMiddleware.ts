import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger"; // Winston logger

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime(); // Capture start time for response time tracking

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2);

    logger.info(
      `[${req.method}] ${req.originalUrl} - ${res.statusCode} (${durationMs} ms)`
    );

    // Optional: Log request body (except sensitive fields like passwords)
    if (req.method !== "GET") {
      logger.debug(`Request Body: ${JSON.stringify(req.body, null, 2)}`);
    }
  });

  next();
};

export default requestLogger;
