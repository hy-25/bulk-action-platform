import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

class EntityUpdater {
  /**
   * Updates records dynamically based on the entity type.
   * @param entity - The name of the entity (e.g., "Contact", "Company", etc.)
   * @param batch - Array of update objects containing identifiers and update data
   * @returns { success: number, failed: number, skipped: number }
   */
  static async updateEntities(entity: string, batch: any[]) {
    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    try {
      const updatePromises = batch.map(async (item) => {
        try {
          const model = EntityUpdater.getModel(entity);
          if (!model) {
            logger.error(`No model found for entity: ${entity}`);
            return;
          }

          const updated = await model.updateMany({
            where: { email: item.email }, // Assumes "email" is the unique identifier
            data: item.updates,
          });

          if (updated.count > 0) {
            successCount++;
          } else {
            skippedCount++;
            logger.warn(`Skipped update: No ${entity} found with email ${item.email}`);
          }
        } catch (error) {
          failedCount++;
          if (error instanceof Error) {
            logger.error(`Failed to update ${entity} with email ${item.email}: ${error.message}`);
          } else {
            logger.error(`Failed to update ${entity} with email ${item.email}: ${JSON.stringify(error)}`);
          }
        }
      });

      await Promise.all(updatePromises);
    } catch (error) {
      logger.error(`Batch processing error for ${entity}: ${error}`);
    }

    return { success: successCount, failed: failedCount, skipped: skippedCount };
  }

  /**
   * Maps an entity name to the corresponding Prisma model
   * @param entity - The entity name (e.g., "Contact", "Company")
   * @returns The corresponding Prisma model or null if not found
   */
  private static getModel(entity: string) {
    const models: Record<string, any> = {
      Contact: prisma.contact,
       // Add more entities here
    };

    return models[entity] || null;
  }
}

export default EntityUpdater;
