import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  handleGetConfiguration,
  handleUpdateConfiguration,
} from "./settings.controller.js";

const router = Router();

router.get("/configuration", asyncHandler(handleGetConfiguration));
router.patch("/configuration", asyncHandler(handleUpdateConfiguration));

export default router;
