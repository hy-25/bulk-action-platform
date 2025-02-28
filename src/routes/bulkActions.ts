import express from "express";
import asyncHandler from "express-async-handler";
import BulkActionController from "../controllers/BulkActionController";

const router = express.Router();


// Define routes using controller methods
router.post("/bulk-actions", asyncHandler(BulkActionController.createBulkAction));
router.get("/bulk-actions", asyncHandler(BulkActionController.listBulkActions));
router.get("/bulk-actions/:id", asyncHandler(BulkActionController.getBulkAction));
router.get("/bulk-actions/:id/stats", asyncHandler(BulkActionController.getBulkActionStats));

export default router;
