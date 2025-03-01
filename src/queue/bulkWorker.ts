import { Worker, Job, Queue } from "bullmq";
import logger from "../utils/logger";
import redisClient from "../config/redisClient";
import { BATCH_PROCESSING_QUEUE, BULK_ACTION_QUEUE, PROCESS_BATCH_JOB } from "../constants/queueConstants";
import * as bulkActionRepository from "../repositeries/bulkActionRepositery";

const batchProcessingQueue = new Queue(BATCH_PROCESSING_QUEUE, { connection: redisClient });
const BATCH_SIZE = 500;

logger.info("Starting Bulk Action Worker...");

const bulkWorker = new Worker(
  BULK_ACTION_QUEUE,
  async (job: Job) => {
    try {
      const { bulkActionId, entity, action, data } = job.data;
      const totalBatches = Math.ceil(data.length / BATCH_SIZE);

      logger.info(`Processing Bulk Action: ${bulkActionId}, Entity: ${entity}, Action: ${action}`);
      logger.info(`Total Batches: ${totalBatches}`);

      // Update status to "In Progress"
      await bulkActionRepository.updateBulkActionStatus(bulkActionId, "In Progress", totalBatches);

      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);

        // Add each batch as a separate job
        await batchProcessingQueue.add(PROCESS_BATCH_JOB, {
          bulkActionId,
          batch,
          entity,
        });
      }

      logger.info(`Bulk action ${bulkActionId} divided into ${totalBatches} batches`);
    } catch (error: any) {
      logger.error(`Error processing bulk action: ${error.message}`);
    }
  },
  { connection: redisClient }
);

logger.info("Bulk Action Worker is running...");

export default bulkWorker;
