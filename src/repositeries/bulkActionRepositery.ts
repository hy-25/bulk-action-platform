import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface BulkAction {
  id: string;
  entity: string;
  action: string;
  status: string;
  createdAt?: Date;
}

export const createBulkAction = async (entity: string, action: string): Promise<BulkAction> => {
  return await prisma.bulkAction.create({
    data: { entity, action, status: "Pending" },
  });
};

export const findBulkActionById = async (id: string): Promise<BulkAction | null> => {
  return await prisma.bulkAction.findUnique({ where: { id } });
};

export const listBulkActions = async (status?: string): Promise<BulkAction[]> => {
  const filter = status ? { status } : {};
  return await prisma.bulkAction.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    take: 1000,
  });
};

export const getBulkActionStats = async (id: string): Promise<{ successCount: number; failedCount: number; skippedCount: number } | null> => {
  return await prisma.bulkAction.findUnique({
    where: { id },
    select: {
      successCount: true,
      failedCount: true,
      skippedCount: true,
    },
  });
};


export const updateBulkActionStats = async (
  bulkActionId: string,
  success: number,
  failed: number,
  skipped: number
) => {
  await prisma.bulkAction.update({
    where: { id: bulkActionId },
    data: {
      successCount: { increment: success },
      failedCount: { increment: failed },
      skippedCount: { increment: skipped },
      remainingBatches: { decrement: 1 },
    },
  });
};

export const getRemainingBatches = async (bulkActionId: string) => {
  return await prisma.bulkAction.findUnique({
    where: { id: bulkActionId },
    select: { remainingBatches: true },
  });
};

export const markBulkActionCompleted = async (bulkActionId: string) => {
  await prisma.bulkAction.update({
    where: { id: bulkActionId },
    data: { status: "Completed" },
  });
};


/**
 * Updates the bulk action status and remaining batch count.
 * @param bulkActionId - The ID of the bulk action.
 * @param status - The new status ("Pending", "In Progress", "Completed").
 * @param remainingBatches - The number of batches left to process.
 */
export const updateBulkActionStatus = async (bulkActionId: string, status: string, remainingBatches: number) => {
  await prisma.bulkAction.update({
    where: { id: bulkActionId },
    data: { status, remainingBatches },
  });
};

