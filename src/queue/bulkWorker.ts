import { Worker, Job, Queue } from "bullmq";
import { PrismaClient } from "@prisma/client";
import connection from "./bulkQueue";
import logger from "../utils/logger";
import { BATCH_PROCESSING_QUEUE, BULK_ACTION_QUEUE, PROCESS_BATCH_JOB } from "./constants";
const batchProcessingQueue = new Queue(BATCH_PROCESSING_QUEUE, { connection });
const BATCH_SIZE = 500; 

const prisma = new PrismaClient();

logger.info("Starting Bulk Action Worker...");

const bulkWorker = new Worker(
    BULK_ACTION_QUEUE,
  async (job: Job) => {
    const { bulkActionId, entity, action, data } = job.data;


    const totalBatches = Math.ceil(data.length / BATCH_SIZE);

    logger.info(`total batches ${totalBatches}`)

    logger.info(`Processing Bulk Action: ${bulkActionId}, Entity: ${entity}, Action: ${action}`);

    // Update status to "In Progress"
    await prisma.bulkAction.update({
      where: { id: bulkActionId },
      data: { status: "In Progress" , remainingBatches : totalBatches},
    });


    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        
        // Add each batch as a separate job
        await batchProcessingQueue.add(PROCESS_BATCH_JOB, {
          bulkActionId,
          batch,
          entity
        });
      }

      logger.info(`Bulk action ${bulkActionId} divided into ${Math.ceil(data.length / BATCH_SIZE)} batches`);
  },
  { connection }
);

logger.info("Bulk Action Worker is running...");
