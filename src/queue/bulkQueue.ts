import { Queue } from "bullmq";
import logger from "../utils/logger";

import redisClient from "../config/redisClient";
import { BULK_ACTION_QUEUE } from "../constants/queueConstants";

logger.info("Initializing Bulk Action Queue...");

export const bulkActionQueue = new Queue(BULK_ACTION_QUEUE, { connection: redisClient });

logger.info("Bulk Action Queue initialized.");

export default bulkActionQueue;
