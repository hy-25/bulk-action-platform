import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Updates entities dynamically based on the identifier field.
 * @param entity - The name of the entity (e.g., "Contact", "Company")
 * @param identifierField - The field used to identify the record (e.g., "email", "id")
 * @param identifierValue - The value to search for (e.g., "user@example.com")
 * @param updates - The fields to update
 * @returns The count of records updated
 */
export const updateEntity = async (
  entity: string,
  identifierField: string,
  identifierValue: string,
  updates: Record<string, any>
): Promise<number> => {
  const model = getModel(entity);
  if (!model) {
    throw new Error(`No model found for entity: ${entity}`);
  }

  const updated = await model.updateMany({
    where: { [identifierField]: identifierValue },
    data: updates,
  });

  return updated.count;
};

/**
 * Maps entity names to Prisma models.
 * @param entity - The entity name (e.g., "Contact", "Company")
 * @returns The corresponding Prisma model or null if not found
 */
const getModel = (entity: string) => {
  const models: Record<string, any> = {
    Contact: prisma.contact,
    // Add more entities here
  };

  return models[entity] || null;
};
