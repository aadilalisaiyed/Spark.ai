import { Request, Response } from "express";
import {
  getAllActivities,
  joinActivity,
  getPendingApprovals,
  updateApproval,
} from "./social.service.js";

export async function handleGetActivities(_req: Request, res: Response) {
  const data = await getAllActivities();
  res.json({ success: true, data });
}

export async function handleJoinActivity(req: Request, res: Response) {
  const id = req.params.id as string;
  const { employeeId, employeeName } = req.body;

  if (!employeeId || !employeeName) {
    res.status(400).json({
      success: false,
      error: "Missing required fields: employeeId, employeeName",
    });
    return;
  }

  const result = await joinActivity(id, employeeId, employeeName);

  if (result.notFound) {
    res.status(404).json({ success: false, error: "Activity not found." });
    return;
  }

  if (result.duplicate) {
    res.status(409).json({
      success: false,
      error: "Employee has already joined this activity.",
    });
    return;
  }

  res.status(201).json({ success: true, data: result.data });
}

export async function handleGetApprovals(_req: Request, res: Response) {
  const data = await getPendingApprovals();
  res.json({ success: true, data });
}

export async function handleUpdateApproval(req: Request, res: Response) {
  const id = req.params.id as string;
  const { approvalStatus, pointsAwarded } = req.body;

  if (!approvalStatus) {
    res.status(400).json({
      success: false,
      error: "Missing required field: approvalStatus ('Approved' | 'Rejected')",
    });
    return;
  }

  const result = await updateApproval(id, {
    approvalStatus,
    pointsAwarded: pointsAwarded || 0,
  });

  if (result.notFound) {
    res.status(404).json({ success: false, error: "Participation not found." });
    return;
  }

  if (result.evidenceMissing) {
    res.status(400).json({ success: false, error: result.message });
    return;
  }

  res.json({ success: true, data: result.data });
}
