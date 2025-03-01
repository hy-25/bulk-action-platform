import logger from "../utils/logger";
import * as entityRepository from "../repositeries/entityRepositery";
import AppError from "../utils/appError";

interface BatchItem {
  identifier: string; // Unique identifier (e.g., email, id)
  updates: Record<string, any>; // Data fields to update
}

class EntityUpdater {
  /**
   * Updates records dynamically based on the entity type.
   * @param entity - The name of the entity (e.g., "Contact", "Company")
   * @param batch - Array of update objects containing identifiers and update data
   * @param identifierField - The field used for identifying records (default: "email")
   * @returns { success: number, failed: number, skipped: number }
   */
  static async updateEntities(entity: string, batch: BatchItem[], identifierField: string = "email") {
    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    try {
      const updatePromises = batch.map(async (item) => {
        try {
          if (!item.identifier || !item.updates) {
            throw new AppError(`Invalid batch item: ${JSON.stringify(item)}`, 400);
          }

          const updated = await entityRepository.updateEntity(entity, identifierField, item.identifier, item.updates);

          if (updated > 0) {
            successCount++;
          } else {
            skippedCount++;
            logger.warn(`Skipped update: No ${entity} found with ${identifierField} = ${item.identifier}`);
          }
        } catch (error) {
          failedCount++;
          logger.error(`Failed to update ${entity} with ${identifierField} = ${item.identifier}: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
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
