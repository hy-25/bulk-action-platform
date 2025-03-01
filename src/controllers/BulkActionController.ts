import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import AppError from "../utils/appError";
import * as bulkActionService from "../services/bulkActionService";

class BulkActionController {
  static async createBulkAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity, action, data, accountId } = req.body;

      if (!entity || !action || !data || !Array.isArray(data) || !accountId) {
        throw new AppError("Invalid request payload. Entity, action, data, and accountId are required.", 400);
      }

      const bulkAction = await bulkActionService.createBulkAction(entity, action, data, accountId);
      res.status(201).json({ message: "Bulk action created", bulkAction });
    } catch (error) {
      next(error); // Pass to errorHandler middleware
    }
  }

  static async listBulkActions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query as { status?: string };
      const bulkActions = await bulkActionService.listBulkActions(status);
      res.json({ bulkActions });
    } catch (error) {
      next(error);
    }
  }

  static async getBulkAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bulkAction = await bulkActionService.getBulkAction(req.params.id);
      if (!bulkAction) {
        throw new AppError("Bulk action not found", 404);
      }
      res.json({ bulkAction });
    } catch (error) {
      next(error);
    }
  }

  static async getBulkActionStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await bulkActionService.getBulkActionStats(req.params.id);
      if (!stats) {
        throw new AppError("Bulk action stats not found", 404);
      }
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default BulkActionController;
