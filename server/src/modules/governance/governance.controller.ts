import { Request, Response } from "express";
import {
  getAllAudits,
  createAudit,
  getAllComplianceIssues,
  resolveComplianceIssue,
} from "./governance.service.js";

export async function handleGetAudits(_req: Request, res: Response) {
  const data = await getAllAudits();
  res.json({ success: true, data });
}

export async function handleCreateAudit(req: Request, res: Response) {
  const { title, departmentId, auditor, date, findings, status } = req.body;

  if (!title || !departmentId || !auditor || !date) {
    res.status(400).json({
      success: false,
      error: "Missing required fields: title, departmentId, auditor, date",
    });
    return;
  }

  const data = await createAudit({
    title,
    departmentId: String(departmentId),
    auditor,
    date,
    findings: findings || "",
    status: status || "Under Review",
  });

  res.status(201).json({ success: true, data });
}

export async function handleGetComplianceIssues(_req: Request, res: Response) {
  const data = await getAllComplianceIssues();
  res.json({ success: true, data });
}

export async function handleResolveComplianceIssue(req: Request, res: Response) {
  const id = req.params.id as string;

  const result = await resolveComplianceIssue(id);

  if (result.notFound) {
    res.status(404).json({
      success: false,
      error: "Compliance issue not found.",
    });
    return;
  }

  res.json({ success: true, data: result.data, message: "Issue resolved successfully." });
}
