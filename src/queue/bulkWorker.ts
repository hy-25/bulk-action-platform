import { Worker, Job } from "bullmq";
import { PrismaClient } from "@prisma/client";
import connection from "./bulkQueue";
import logger from "../utils/logger"; // Import logger

const prisma = new PrismaClient();

logger.info("Starting Bulk Action Worker...");

const bulkWorker = new Worker(
  "bulk-actions",
  async (job: Job) => {
    const { bulkActionId, entity, action, data } = job.data;

    logger.info(`Processing Bulk Action: ${bulkActionId}, Entity: ${entity}, Action: ${action}`);

    // Update status to "In Progress"
    await prisma.bulkAction.update({
      where: { id: bulkActionId },
      data: { status: "In Progress" },
    });

    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const item of data) {
      try {
        logger.info(`Updating contact: ${item.email} with ${JSON.stringify(item.updates)}`);

        const updated = await prisma.contact.updateMany({
          where: { email: item.email },
          data: item.updates,
        });

        if (updated.count > 0) {
          successCount++;
        } else {
          skippedCount++; // Email not found
          logger.warn(`Skipped update: No contact found with email ${item.email}`);
        }
      } catch (error) {
        failedCount++;
        if (error instanceof Error) {
          logger.error(`Failed to update ${item.email}: ${error.message}`);
        } else {
          logger.error(`Failed to update ${item.email}: ${JSON.stringify(error)}`);
        }
      }
    }

    // Update the bulk action with final counts
    await prisma.bulkAction.update({
      where: { id: bulkActionId },
      data: {
        status: "Completed",
        successCount,
        failedCount,
        skippedCount,
      },
    });

    logger.info(
      `Bulk Action Completed: ${bulkActionId} | Success: ${successCount}, Failed: ${failedCount}, Skipped: ${skippedCount}`
    );

    return { successCount, failedCount, skippedCount };
  },
  { connection }
);

logger.info("Bulk Action Worker is running...");
