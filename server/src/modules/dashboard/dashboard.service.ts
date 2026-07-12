import pool from "../../config/db.js";

/**
 * Fetch ESG sub-scores from the database and compute weighted overall.
 * Reads custom weights from the system_settings table.
 */
export async function getESGScores() {
  // 1. Get custom weights from settings
  const settingsResult = await pool.query(
    `SELECT weight_environmental, weight_social, weight_governance
     FROM system_settings
     LIMIT 1`
  );

  // Default weights if no settings row exists
  const weights = settingsResult.rows[0] || {
    weight_environmental: 0.33,
    weight_social: 0.33,
    weight_governance: 0.34,
  };

  const wE = parseFloat(weights.weight_environmental);
  const wS = parseFloat(weights.weight_social);
  const wG = parseFloat(weights.weight_governance);

  // 2. Calculate Environmental score (avg progress of active goals)
  const envResult = await pool.query(
    `SELECT COALESCE(ROUND(AVG(progress)), 0) AS score
     FROM goals
     WHERE status = 'Active'`
  );
  const environmental = Number(envResult.rows[0].score);

  // 3. Calculate Social score (based on approved participation rate)
  const socialResult = await pool.query(
    `SELECT COALESCE(
       ROUND(
         (COUNT(*) FILTER (WHERE approval_status = 'Approved')::DECIMAL /
          NULLIF(COUNT(*), 0)) * 100
       ), 0
     ) AS score
     FROM employee_participation`
  );
  const social = Number(socialResult.rows[0].score);

  // 4. Calculate Governance score (based on resolved compliance rate)
  const govResult = await pool.query(
    `SELECT COALESCE(
       ROUND(
         (COUNT(*) FILTER (WHERE status = 'Resolved')::DECIMAL /
          NULLIF(COUNT(*), 0)) * 100
       ), 0
     ) AS score
     FROM compliance_issues`
  );
  const governance = Number(govResult.rows[0].score);

  // 5. Weighted overall calculation
  const overall = Math.round(environmental * wE + social * wS + governance * wG);

  return { environmental, social, governance, overall };
}

/**
 * Aggregate total emissions by month for the past 12 months.
 * Empty months default to 0.
 */
export async function getEmissionsTrend() {
  const result = await pool.query(`
    WITH months AS (
      SELECT TO_CHAR(d, 'Mon') AS month,
             EXTRACT(MONTH FROM d) AS month_num,
             EXTRACT(YEAR FROM d) AS year_num,
             d AS month_start
      FROM generate_series(
        DATE_TRUNC('month', NOW()) - INTERVAL '11 months',
        DATE_TRUNC('month', NOW()),
        INTERVAL '1 month'
      ) AS d
    )
    SELECT m.month,
           COALESCE(SUM(ct.calculated_emissions), 0)::INTEGER AS emissions
    FROM months m
    LEFT JOIN carbon_transactions ct
      ON DATE_TRUNC('month', ct.transaction_date) = m.month_start
    GROUP BY m.month, m.month_num, m.year_num
    ORDER BY m.year_num, m.month_num
  `);

  return result.rows;
}

/**
 * Department rankings: average ESG goal progress grouped by department.
 */
export async function getDepartmentRankings() {
  const result = await pool.query(`
    SELECT d.name AS department,
           COALESCE(ROUND(ds.total_score), 0)::INTEGER AS score,
           'stable' AS trend
    FROM departments d
    LEFT JOIN department_scores ds ON ds.department_id = d.id
    ORDER BY score DESC
  `);

  return result.rows;
}

/**
 * Recent activity: unified feed from the 5 most recent events
 * across goals, CSR activities, and audits.
 */
export async function getRecentActivity() {
  const result = await pool.query(`
    (
      SELECT id::TEXT, 'emission' AS type,
             name AS title,
             'Goal progress: ' || progress || '%' AS description,
             created_at AS timestamp,
             '📊' AS icon
      FROM goals
      ORDER BY created_at DESC LIMIT 5
    )
    UNION ALL
    (
      SELECT id::TEXT, 'csr' AS type,
             title,
             'Status: ' || status AS description,
             created_at AS timestamp,
             '🌱' AS icon
      FROM csr_activities
      ORDER BY created_at DESC LIMIT 5
    )
    UNION ALL
    (
      SELECT id::TEXT, 'audit' AS type,
             title,
             findings AS description,
             created_at AS timestamp,
             '✓' AS icon
      FROM audits
      ORDER BY created_at DESC LIMIT 5
    )
    ORDER BY timestamp DESC
    LIMIT 5
  `);

  return result.rows;
}
