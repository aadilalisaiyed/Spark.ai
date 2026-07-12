import { Request, Response } from "express";
import {
  getESGScores,
  getEmissionsTrend,
  getDepartmentRankings,
  getRecentActivity,
} from "./dashboard.service.js";

export async function handleGetScores(_req: Request, res: Response) {
  const data = await getESGScores();
  res.json({ success: true, data });
}

export async function handleGetEmissionsTrend(_req: Request, res: Response) {
  const data = await getEmissionsTrend();
  res.json({ success: true, data });
}

export async function handleGetDepartmentRankings(_req: Request, res: Response) {
  const data = await getDepartmentRankings();
  res.json({ success: true, data });
}

export async function handleGetRecentActivity(_req: Request, res: Response) {
  const data = await getRecentActivity();
  res.json({ success: true, data });
}
