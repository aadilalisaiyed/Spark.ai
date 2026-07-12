import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { handleGetLeaderboard } from "./gamification.controller.js";

const router = Router();

router.get("/leaderboard", asyncHandler(handleGetLeaderboard));

export default router;
