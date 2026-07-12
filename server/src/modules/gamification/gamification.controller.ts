import { Request, Response } from "express";
import { getLeaderboard } from "./gamification.service.js";

export async function handleGetLeaderboard(_req: Request, res: Response) {
  const data = await getLeaderboard();
  res.json({ success: true, data });
}
