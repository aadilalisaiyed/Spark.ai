import { Request, Response } from "express";
import { getConfiguration, updateConfiguration } from "./settings.service.js";

export async function handleGetConfiguration(_req: Request, res: Response) {
  const data = await getConfiguration();
  res.json({ success: true, data });
}

export async function handleUpdateConfiguration(req: Request, res: Response) {
  const {
    autoEmissionCalculation,
    requireEvidenceForCSR,
    autoBadgeAward,
    emailAlerts,
    weightEnvironmental,
    weightSocial,
    weightGovernance,
  } = req.body;

  const result = await updateConfiguration({
    autoEmissionCalculation,
    requireEvidenceForCSR,
    autoBadgeAward,
    emailAlerts,
    weightEnvironmental,
    weightSocial,
    weightGovernance,
  });

  if (result.noChanges) {
    res.status(400).json({
      success: false,
      error: "No valid fields provided for update.",
    });
    return;
  }

  res.json({
    success: true,
    data: result.data,
    message: "Configuration updated successfully.",
  });
}
