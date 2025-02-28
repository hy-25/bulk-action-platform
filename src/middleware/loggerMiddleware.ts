import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger"; // Import Winston logger

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.originalUrl}`); // Logs method & route
  next();
};

export default requestLogger;