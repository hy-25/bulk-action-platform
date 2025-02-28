import { Request, Response } from "express";
import fs from "fs";
import path from "path";

class LogController {
  /**
   * Fetch logs with optional filters
   * Example: GET /api/logs?level=error&bulkActionId=12345&startDate=2024-02-27
   */
  static async getLogs(req: Request, res: Response) {
    try {
      const { level, bulkActionId, startDate, endDate, page = 1, limit = 20 } = req.query;
      const logFilePath = path.join(__dirname, "../../logs/combined.log");

      if (!fs.existsSync(logFilePath)) {
        res.status(404).json({ error: "Log file not found" });
        return 
      }

      // Read and parse logs
      const logData = fs.readFileSync(logFilePath, "utf8").split("\n").filter(Boolean);
      let logs = logData.map((line) => JSON.parse(line));

      // Apply filters
      if (level) {
        logs = logs.filter((log) => log.level === level);
      }
      if (bulkActionId) {
        logs = logs.filter((log) => log.message.includes(bulkActionId));
      }
      if (startDate) {
        logs = logs.filter((log) => new Date(log.timestamp) >= new Date(startDate as string));
      }
      if (endDate) {
        logs = logs.filter((log) => new Date(log.timestamp) <= new Date(endDate as string));
      }

      // Paginate results
      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
      const startIndex = (pageNumber - 1) * pageSize;
      const paginatedLogs = logs.slice(startIndex, startIndex + pageSize);

       res.json({
        totalLogs: logs.length,
        page: pageNumber,
        pageSize: pageSize,
        logs: paginatedLogs
      });
      return
    } catch (error) {
       res.status(500).json({ error: "Failed to retrieve logs" });
       return
    }
  }
}

export default LogController;
