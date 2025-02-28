import express from "express";
import dotenv from "dotenv";
import bulkActionRoutes from "./routes/bulkActions";
import "./queue/bulkWorker"; 
import "./queue/batchWorker";
import logger from "./utils/logger";
import requestLogger from "./middleware/loggerMiddleware";
import redisConnection from "./queue/bulkQueue";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(requestLogger);

const PORT = process.env.PORT || 3000;

// API Routes
app.use("/api", bulkActionRoutes);

// Health Check
app.get("/", (_, res) => {
  res.send({status : "UP"});
});


process.on("SIGINT", async () => {
    try {
        await redisConnection.quit(); 
        logger.info("All connections closed. Exiting...");
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1); // Exit with error
      }
});

app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
