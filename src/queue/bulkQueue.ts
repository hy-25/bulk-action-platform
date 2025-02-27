import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { config } from "dotenv";
import logger from "../utils/logger"; // Import the logger

config();

logger.info("Initializing Redis connection for BullMQ...");

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // Fixes the issue
});

connection.on("connect", () => {
  logger.info("Connected to Redis successfully.");
});

connection.on("error", (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

export const bulkActionQueue = new Queue("bulk-actions", { connection });

logger.info("Bulk Action Queue initialized.");

export default connection;
