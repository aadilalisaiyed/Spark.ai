import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetGoals,
  handleCreateGoal,
  handleCreateTransaction,
} from "./environmental.controller.js";

const router = Router();

router.get("/goals", asyncHandler(handleGetGoals));
router.post("/goals", asyncHandler(handleCreateGoal));
router.post("/transactions", asyncHandler(handleCreateTransaction));

export default router;
