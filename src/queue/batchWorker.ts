import { Worker, Job } from "bullmq";
import redisClient from "../config/redisClient";
import logger from "../utils/logger";
import * as bulkActionRepository from "../repositeries/bulkActionRepositery";
import { BATCH_PROCESSING_QUEUE } from "../constants/queueConstants";
import EntityUpdater from "../services/EntryUpdater";


const batchWorker = new Worker(
  BATCH_PROCESSING_QUEUE,
  async (job: Job) => {
    try {
      const { bulkActionId, batch, entity } = job.data;
      logger.info(`Processing batch for Bulk Action: ${bulkActionId}, Records: ${batch.length}`);

      // Process entity updates
      const { success, failed, skipped } = await EntityUpdater.updateEntities(entity, batch);

      // Update bulk action stats
      await bulkActionRepository.updateBulkActionStats(bulkActionId, success, failed, skipped);

      logger.info(`Batch Completed: Success: ${success}, Failed: ${failed}, Skipped: ${skipped}`);

      // Check if all batches are processed
      const bulkAction = await bulkActionRepository.getRemainingBatches(bulkActionId);

      if (bulkAction?.remainingBatches === 0) {
        await bulkActionRepository.markBulkActionCompleted(bulkActionId);
        logger.info(`Bulk Action ${bulkActionId} marked as Completed.`);
      }
    } catch (error: any) {
      logger.error(`Error processing batch: ${error.message}`);
    }
  },
  { connection: redisClient }
);

logger.info("Batch Worker is running...");

export default batchWorker;
