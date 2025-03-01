import logger from "../utils/logger";
import * as entityRepository from "../repositeries/entityRepositery";
import AppError from "../utils/appError";

interface BatchItem {
  email: string; // Unique identifier (e.g., email, id)
  updates: Record<string, any>; // Data fields to update
}

class EntityUpdater {
  static async updateEntities(entity: string, batch: BatchItem[]) {
    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    try {
      const updatePromises = batch.map(async (item) => {
        try {
          if (!item.email || !item.updates) {
            throw new AppError(`Invalid batch item: ${JSON.stringify(item)}`, 400);
          }

          const updated = await entityRepository.updateEntity(entity, "email", item.email, item.updates);

          if (updated > 0) {
            successCount++;
          } else {
            skippedCount++;
            logger.warn(`Skipped update: No ${entity} found with email = ${item.email}`);
          }
        } catch (error) {
          failedCount++;
          logger.error(`Failed to update ${entity} with email = ${item.email}: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        }
      });

      await Promise.all(updatePromises);
    } catch (error) {
      logger.error(`Batch processing error for ${entity}: ${error}`);
    }

    return { success: successCount, failed: failedCount, skipped: skippedCount };
  }
}

export default EntityUpdater;
