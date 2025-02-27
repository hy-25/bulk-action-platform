import express from "express";
import dotenv from "dotenv";
import bulkActionRoutes from "./routes/bulkActions";
import "./queue/bulkWorker"; // Start the worker
import logger from "./utils/logger";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// API Routes
app.use("/api", bulkActionRoutes);

// Health Check
app.get("/", (_, res) => {
  logger.info("Health check endpoint hit");
  res.send("Bulk Action Platform is running!");
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  logger.info("Server shutting down...");
  process.exit(0);
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
