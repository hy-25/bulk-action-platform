import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import AppError from "../utils/appError";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  logger.error(`Error: ${message} - Path: ${req.originalUrl}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
