import pool from "../../config/db.js";

/**
 * Leaderboard: employees sorted by XP descending, computed from employee_participation points.
 */
export async function getLeaderboard() {
  const result = await pool.query(`
    SELECT
      ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(points_earned), 0) DESC)::INTEGER AS rank,
      employee_id AS "employeeId",
      employee_name AS name,
      'R&D' AS department,
      COALESCE(SUM(points_earned), 0)::INTEGER AS xp,
      0 AS badges,
      COUNT(DISTINCT activity_id)::INTEGER AS challenges
    FROM employee_participation
    WHERE approval_status = 'Approved'
    GROUP BY employee_id, employee_name
    ORDER BY xp DESC
    LIMIT 50
  `);

  return result.rows;
}
