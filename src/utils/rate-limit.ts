import redisConnection from "../queue/bulkQueue";

const RATE_LIMIT = 100000; // 10k events per minute

 async function checkRateLimit(accountId: string) {
  const key = `rate_limit:${accountId}`;
  const currentCount = await redisConnection.incr(key);

  if (currentCount === 1) {
    await redisConnection.expire(key, 60); // Reset counter every minute
  }

  return currentCount <= RATE_LIMIT;
}

export default checkRateLimit;