import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetActivities,
  handleJoinActivity,
  handleGetApprovals,
  handleUpdateApproval,
} from "./social.controller.js";

const router = Router();

router.get("/activities", asyncHandler(handleGetActivities));
router.post("/activities/:id/join", asyncHandler(handleJoinActivity));
router.get("/approvals", asyncHandler(handleGetApprovals));
router.patch("/approvals/:id", asyncHandler(handleUpdateApproval));

export default router;
