import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { bulkActionQueue } from "../queue/bulkQueue";
import logger from "../utils/logger";
import { BULK_ACTION_JOB } from "../queue/constants";
import checkRateLimit from "../utils/rate-limit";


const prisma = new PrismaClient();

class BulkActionController {
  // Create a new bulk action
  static async createBulkAction(req: Request, res: Response) {
    try {
      const { entity, action, data , accountId } = req.body;
    
    if(accountId === null || accountId === undefined){
        res.status(400).json({
            error: "Account ID is required"
        })
    }

      if (!await checkRateLimit(accountId)) {
        res.status(429).json({ error: "Rate limit exceeded. Try again later." });
        return 
      }

      if (!entity || !action || !data || !Array.isArray(data)) {
        logger.warn("Invalid request payload for bulk action");
        res.status(400).json({ error: "Invalid request payload" });
        return ;
      }

      // Store the bulk action in the database
      const bulkAction = await prisma.bulkAction.create({
        data: { entity, action, status: "Pending" },
      });

      // Add job to the queue
      await bulkActionQueue.add(BULK_ACTION_JOB, {
        bulkActionId: bulkAction.id,
        entity,
        action,
        data,
      });

      logger.info(`Bulk action created: ${bulkAction.id}`);
      res.status(201).json({ message: "Bulk action created", bulkAction });
      return 
    } catch (error) {
      logger.error(`Error creating bulk action: ${(error as Error).message}`);
       res.status(500).json({ error: "Internal Server Error" });
       return;
    }
  }

  // List all bulk actions
  static async listBulkActions(req: Request, res: Response) {

    const { status } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = String(status);
    }


    try {
      const bulkActions = await prisma.bulkAction.findMany({
        where: filter,
        orderBy: { createdAt: "desc" },
        take: 1000,
      });

      logger.info(`Fetched ${bulkActions.length} bulk actions`);
      res.json({ bulkActions });
      return 
    } catch (error) {
      logger.error(`Error fetching bulk actions: ${(error as Error).message}`);
       res.status(500).json({ error: "Internal Server Error" });
       return
    }
  }

  // Get bulk action details
  static async getBulkAction(req: Request, res: Response) {
    try {
      const bulkAction = await prisma.bulkAction.findUnique({
        where: { id: req.params.id },
      });

      if (!bulkAction) {
        logger.warn(`Bulk action not found: ${req.params.id}`);
         res.status(404).json({ error: "Bulk action not found" });
         return
      }

      logger.info(`Fetched bulk action details: ${bulkAction.id}`);
       res.json({ bulkAction });
       return
    } catch (error) {
      logger.error(`Error fetching bulk action: ${(error as Error).message}`);
       res.status(500).json({ error: "Internal Server Error" });
       return
    }
  }

  // Get bulk action stats
  static async getBulkActionStats(req: Request, res: Response) {
    try {
      const bulkAction = await prisma.bulkAction.findUnique({
        where: { id: req.params.id },
        select: {
          successCount: true,
          failedCount: true,
          skippedCount: true,
        },
      });

      if (!bulkAction) {
        logger.warn(`Bulk action stats not found: ${req.params.id}`);
         res.status(404).json({ error: "Bulk action not found" });
         return
      }

      logger.info(`Fetched bulk action stats: ${req.params.id}`);
       res.json(bulkAction);
       return
    } catch (error) {
      logger.error(`Error fetching bulk action stats: ${(error as Error).message}`);
       res.status(500).json({ error: "Internal Server Error" });
       return
    }
  }
}

export default BulkActionController;
