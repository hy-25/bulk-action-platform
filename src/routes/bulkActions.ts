import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { bulkActionQueue } from "../queue/bulkQueue";
import logger from "../utils/logger"; // Import the logger

const router = express.Router();
const prisma = new PrismaClient();

// Create a new bulk action
router.post(
  "/bulk-actions",
  asyncHandler(async (req, res) => {
    const { entity, action, data } = req.body;

    if (!entity || !action || !data || !Array.isArray(data)) {
      logger.warn("Invalid request payload for bulk action");
      res.status(400).json({ error: "Invalid request payload" });
      return;
    }

    // Store the bulk action in the database
    const bulkAction = await prisma.bulkAction.create({
      data: { entity, action, status: "Pending" },
    });

    // Add job to the queue
    await bulkActionQueue.add("processBulkAction", {
      bulkActionId: bulkAction.id,
      entity,
      action,
      data,
    });

    logger.info(`Bulk action created: ${bulkAction.id}`);
    res.status(201).json({ message: "Bulk action created", bulkAction });
  })
);

// List all bulk actions
router.get(
  "/bulk-actions",
  asyncHandler(async (req, res) => {
    const bulkActions = await prisma.bulkAction.findMany({
      orderBy: { createdAt: "desc" },
    });

    logger.info(`Fetched ${bulkActions.length} bulk actions`);
    res.json({ bulkActions });
  })
);

// Get bulk action details
router.get(
  "/bulk-actions/:id",
  asyncHandler(async (req, res) => {
    const bulkAction = await prisma.bulkAction.findUnique({
      where: { id: req.params.id },
    });

    if (!bulkAction) {
      logger.warn(`Bulk action not found: ${req.params.id}`);
      res.status(404).json({ error: "Bulk action not found" });
      return;
    }

    logger.info(`Fetched bulk action details: ${bulkAction.id}`);
    res.json({ bulkAction });
  })
);

// Get bulk action stats (success, failed, skipped)
router.get(
  "/bulk-actions/:id/stats",
  asyncHandler(async (req, res) => {
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
      return;
    }

    logger.info(`Fetched bulk action stats: ${req.params.id}`);
    res.json(bulkAction);
  })
);

export default router;
