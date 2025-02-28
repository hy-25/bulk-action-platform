import { Worker, Job } from "bullmq";
import { PrismaClient } from "@prisma/client";
import connection from "./bulkQueue";
import logger from "../utils/logger";
import { BATCH_PROCESSING_QUEUE } from "./constants";
import EntityUpdater from "../services/EntryUpdater";

const prisma = new PrismaClient();

const batchWorker = new Worker(
  BATCH_PROCESSING_QUEUE,
  async (job: Job) => {
    const { bulkActionId, batch , entity } = job.data;
    logger.info(`Processing batch for Bulk Action: ${bulkActionId}, Records: ${batch.length}`);

    const { success, failed, skipped } = await EntityUpdater.updateEntities(entity, batch);

    // Update bulk action stats
    await prisma.bulkAction.update({
      where: { id: bulkActionId },
      data: {
        successCount: { increment: success },
        failedCount: { increment: failed },
        skippedCount: { increment: skipped },
        remainingBatches: { decrement: 1 },
      },
    });
    

    logger.info(`Batch Completed: Success: ${success}, Failed: ${failed}, Skipped: ${skipped}`);

    const bulkAction = await prisma.bulkAction.findUnique({
        where: { id: bulkActionId },
        select: { remainingBatches: true },
      })


      if (bulkAction?.remainingBatches === 0) {
        await prisma.bulkAction.update({
          where: { id: bulkActionId },
          data: { status: "Completed" },
        });
        logger.info(`Bulk Action ${bulkActionId} marked as Completed.`);
      }
  },
  { connection }
);

logger.info("Batch Worker is running...");
