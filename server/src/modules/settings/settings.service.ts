import pool from "../../config/db.js";

/**
 * Fetch system configuration (toggle flags and weights).
 */
export async function getConfiguration() {
  const result = await pool.query(`
    SELECT
      id,
      auto_emission_calculation AS "autoEmissionCalculation",
      require_evidence_for_csr AS "requireEvidenceForCSR",
      auto_badge_award AS "autoBadgeAward",
      email_alerts AS "emailAlerts",
      weight_environmental AS "weightEnvironmental",
      weight_social AS "weightSocial",
      weight_governance AS "weightGovernance",
      updated_at AS "updatedAt"
    FROM system_settings
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    // Return defaults if no settings row exists yet
    return {
      autoEmissionCalculation: true,
      requireEvidenceForCSR: false,
      autoBadgeAward: true,
      emailAlerts: true,
      weightEnvironmental: 0.33,
      weightSocial: 0.33,
      weightGovernance: 0.34,
    };
  }

  return result.rows[0];
}

/**
 * Update system configuration toggles and/or weights.
 * Accepts partial updates — only the provided keys are changed.
 */
export async function updateConfiguration(updates: {
  autoEmissionCalculation?: boolean;
  requireEvidenceForCSR?: boolean;
  autoBadgeAward?: boolean;
  emailAlerts?: boolean;
  weightEnvironmental?: number;
  weightSocial?: number;
  weightGovernance?: number;
}) {
  // Build SET clause dynamically from provided fields
  const fieldMap: Record<string, string> = {
    autoEmissionCalculation: "auto_emission_calculation",
    requireEvidenceForCSR: "require_evidence_for_csr",
    autoBadgeAward: "auto_badge_award",
    emailAlerts: "email_alerts",
    weightEnvironmental: "weight_environmental",
    weightSocial: "weight_social",
    weightGovernance: "weight_governance",
  };

  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const [key, column] of Object.entries(fieldMap)) {
    if ((updates as any)[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex}`);
      values.push((updates as any)[key]);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) {
    return { noChanges: true };
  }

  // Add updated_at
  setClauses.push(`updated_at = NOW()`);

  // Check if a settings row exists
  const existing = await pool.query(`SELECT id FROM system_settings LIMIT 1`);

  if (existing.rows.length === 0) {
    // Insert default row first, then update
    await pool.query(
      `INSERT INTO system_settings (auto_emission_calculation, require_evidence_for_csr, auto_badge_award, email_alerts, weight_environmental, weight_social, weight_governance)
       VALUES (true, false, true, true, 0.33, 0.33, 0.34)`
    );
  }

  const result = await pool.query(
    `UPDATE system_settings
     SET ${setClauses.join(", ")}
     WHERE id = (SELECT id FROM system_settings LIMIT 1)
     RETURNING
       auto_emission_calculation AS "autoEmissionCalculation",
       require_evidence_for_csr AS "requireEvidenceForCSR",
       auto_badge_award AS "autoBadgeAward",
       email_alerts AS "emailAlerts",
       weight_environmental AS "weightEnvironmental",
       weight_social AS "weightSocial",
       weight_governance AS "weightGovernance",
       updated_at AS "updatedAt"`,
    values
  );

  return { data: result.rows[0] };
}
