import { Request, Response, NextFunction } from "express";
import { getFilteredLogs, LogQueryParams } from "../services/logService";
import AppError from "../utils/appError";

class LogController {
  static async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const query: LogQueryParams = {
        level: req.query.level as string,
        bulkActionId: req.query.bulkActionId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      };

      const logs = getFilteredLogs(query);
      if (!logs.logs.length) {
        throw new AppError("No logs found for the given filters", 404);
      }

      res.json(logs);
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  }
}

export default LogController;
