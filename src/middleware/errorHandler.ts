import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger"; // Import Winston logger

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message} - Path: ${req.originalUrl}`);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
