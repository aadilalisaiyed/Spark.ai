import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetScores,
  handleGetEmissionsTrend,
  handleGetDepartmentRankings,
  handleGetRecentActivity,
} from "./dashboard.controller.js";

const router = Router();

router.get("/scores", asyncHandler(handleGetScores));
router.get("/emissions-trend", asyncHandler(handleGetEmissionsTrend));
router.get("/department-rankings", asyncHandler(handleGetDepartmentRankings));
router.get("/recent-activity", asyncHandler(handleGetRecentActivity));

export default router;
