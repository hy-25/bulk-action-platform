import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { config } from "dotenv";
import logger from "../utils/logger"; // Import the logger
import { BULK_ACTION_QUEUE } from "./constants";

config();

logger.info("Initializing Redis connection for BullMQ...");

const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  logger.info("Connected to Redis successfully.");
});

redisConnection.on("error", (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

export const bulkActionQueue = new Queue(BULK_ACTION_QUEUE, { connection: redisConnection });

logger.info("Bulk Action Queue initialized.");

export default redisConnection;
