import { getRawLogs } from "../repositeries/logRepositery";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export interface LogQueryParams {
  level?: string;
  bulkActionId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const getFilteredLogs = (query: LogQueryParams) => {
  const { level, bulkActionId, startDate, endDate, page = 1, limit = 20 } = query;
  let logs: LogEntry[] = getRawLogs().map((line) => JSON.parse(line));

  // Apply filters
  if (level) logs = logs.filter((log) => log.level === level);
  if (bulkActionId) logs = logs.filter((log) => log.message.includes(bulkActionId));
  if (startDate) logs = logs.filter((log) => new Date(log.timestamp) >= new Date(startDate));
  if (endDate) logs = logs.filter((log) => new Date(log.timestamp) <= new Date(endDate));

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedLogs = logs.slice(startIndex, startIndex + limit);

  return {
    totalLogs: logs.length,
    page,
    pageSize: limit,
    logs: paginatedLogs,
  };
};
