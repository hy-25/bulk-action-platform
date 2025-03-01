import { bulkActionQueue } from "../queue/bulkQueue";
import logger from "../utils/logger";

import checkRateLimit from "../utils/rate-limit";
import * as bulkActionRepository from "../repositeries/bulkActionRepositery";
import { BULK_ACTION_JOB } from "../constants/queueConstants";

export const createBulkAction = async (entity: string, action: string, data: any[], accountId: string): Promise<any> => {
  if (!accountId) {
    throw new Error("Account ID is required");
  }

  const isRateLimited = await checkRateLimit(accountId);
  if (!isRateLimited) {
    throw new Error("Rate limit exceeded. Try again later.");
  }

  if (!entity || !action || !data || !Array.isArray(data)) {
    throw new Error("Invalid request payload");
  }

  const bulkAction = await bulkActionRepository.createBulkAction(entity, action);

  await bulkActionQueue.add(BULK_ACTION_JOB, {
    bulkActionId: bulkAction.id,
    entity,
    action,
    data,
  });

  logger.info(`Bulk action created: ${bulkAction.id}`);
  return bulkAction;
};

export const listBulkActions = async (status?: string) => {
  return await bulkActionRepository.listBulkActions(status);
};

export const getBulkAction = async (id: string) => {
  return await bulkActionRepository.findBulkActionById(id);
};

export const getBulkActionStats = async (id: string) => {
  return await bulkActionRepository.getBulkActionStats(id);
};
