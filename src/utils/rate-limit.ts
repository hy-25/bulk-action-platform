import redisClient from "../config/redisClient";

const RATE_LIMIT = 10000; // 10k events per minute

 async function checkRateLimit(accountId: string) {
  const key = `rate_limit:${accountId}`;
  const currentCount = await redisClient.incr(key);

  if (currentCount === 1) {
    await redisClient.expire(key, 60); // Reset counter every minute
  }

  return currentCount <= RATE_LIMIT;
}

export default checkRateLimit;