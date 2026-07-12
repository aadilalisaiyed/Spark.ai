import pool from "../../config/db.js";

/**
 * Fetch all environmental goals joined with department names.
 */
export async function getAllGoals() {
  const result = await pool.query(`
    SELECT g.id,
           g.name,
           d.name AS department,
           g.target_co2 AS "targetCO2",
           g.current_co2 AS "currentCO2",
           g.progress,
           g.deadline,
           g.status,
           g.created_at AS "createdAt"
    FROM goals g
    JOIN departments d ON d.id = g.department_id
    ORDER BY g.created_at DESC
  `);

  return result.rows;
}

/**
 * Insert a new environmental goal.
 */
export async function createGoal(data: {
  name: string;
  departmentId: string;
  targetCO2: number;
  deadline: string;
}) {
  const result = await pool.query(
    `INSERT INTO goals (name, department_id, target_co2, current_co2, progress, deadline, status)
     VALUES ($1, $2, $3, 0, 0, $4, 'Active')
     RETURNING id, name, department_id AS "departmentId", target_co2 AS "targetCO2",
               current_co2 AS "currentCO2", progress, deadline, status,
               created_at AS "createdAt"`,
    [data.name, data.departmentId, data.targetCO2, data.deadline]
  );

  return result.rows[0];
}

/**
 * Insert a carbon transaction.
 * If autoEmissionCalculation is ON in system_settings, block the manual insert (400).
 * Otherwise, insert with explicit CO2 conversion multiplier.
 */
export async function createTransaction(data: {
  source: string;
  amount: number;
  emissionFactor: number;
  transactionDate?: string;
}) {
  // 1. Check system settings for auto-calc flag
  const settingsResult = await pool.query(
    `SELECT auto_emission_calculation FROM system_settings LIMIT 1`
  );

  const settings = settingsResult.rows[0];
  if (settings?.auto_emission_calculation === true) {
    return {
      blocked: true,
      message:
        "Auto emission calculation is enabled. Manual carbon transaction entry is disabled. " +
        "Turn off 'autoEmissionCalculation' in Settings to allow manual entries.",
    };
  }

  // 2. Calculate CO2 using explicit multiplier: amount × emissionFactor
  const calculatedEmissions = data.amount * data.emissionFactor;
  const transactionDate = data.transactionDate || new Date().toISOString().split("T")[0];

  const result = await pool.query(
    `INSERT INTO carbon_transactions
       (source, amount, calculated_emissions, transaction_date)
     VALUES ($1, $2, $3, $4)
     RETURNING id, source, amount,
               calculated_emissions AS "calculatedEmissions",
               transaction_date AS "transactionDate"`,
    [data.source, data.amount, calculatedEmissions, transactionDate]
  );

  return { blocked: false, data: result.rows[0] };
}
