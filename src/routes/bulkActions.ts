import express from "express";
import asyncHandler from "express-async-handler";
import BulkActionController from "../controllers/BulkActionController";

const router = express.Router();

router.post("/", asyncHandler(BulkActionController.createBulkAction));
router.get("/", asyncHandler(BulkActionController.listBulkActions));
router.get("/:id", asyncHandler(BulkActionController.getBulkAction));
router.get("/:id/stats", asyncHandler(BulkActionController.getBulkActionStats));

export default router;
