import { Request, Response } from "express";
import {
  getAllGoals,
  createGoal,
  createTransaction,
} from "./environmental.service.js";

export async function handleGetGoals(_req: Request, res: Response) {
  const data = await getAllGoals();
  res.json({ success: true, data });
}

export async function handleCreateGoal(req: Request, res: Response) {
  const { name, departmentId, targetCO2, deadline } = req.body;

  if (!name || !departmentId || !targetCO2 || !deadline) {
    res.status(400).json({
      success: false,
      error: "Missing required fields: name, departmentId, targetCO2, deadline",
    });
    return;
  }

  const data = await createGoal({ name, departmentId: String(departmentId), targetCO2, deadline });
  res.status(201).json({ success: true, data });
}

export async function handleCreateTransaction(req: Request, res: Response) {
  const { source, amount, emissionFactor, transactionDate } = req.body;

  if (!source || amount === undefined || emissionFactor === undefined) {
    res.status(400).json({
      success: false,
      error: "Missing required fields: source, amount, emissionFactor",
    });
    return;
  }

  const result = await createTransaction({
    source,
    amount: Number(amount),
    emissionFactor: Number(emissionFactor),
    transactionDate,
  });

  if (result.blocked) {
    res.status(400).json({ success: false, error: result.message });
    return;
  }

  res.status(201).json({ success: true, data: result.data });
}
