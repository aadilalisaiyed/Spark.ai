import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetAudits,
  handleCreateAudit,
  handleGetComplianceIssues,
  handleResolveComplianceIssue,
} from "./governance.controller.js";

const router = Router();

router.get("/audits", asyncHandler(handleGetAudits));
router.post("/audits", asyncHandler(handleCreateAudit));
router.get("/compliance-issues", asyncHandler(handleGetComplianceIssues));
router.patch("/compliance-issues/:id", asyncHandler(handleResolveComplianceIssue));

export default router;
