import express from "express";
import asyncHandler from "express-async-handler";
import LogController from "../controllers/LogController";

const router = express.Router();

router.get("/", asyncHandler(LogController.getLogs));

export default router;
