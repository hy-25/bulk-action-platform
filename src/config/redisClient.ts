import { Redis } from "ioredis";
import { config } from "dotenv";
import logger from "../utils/logger";

config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

logger.info("Initializing Redis connection...");

const redisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis successfully.");
});

redisClient.on("error", (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

export default redisClient;
