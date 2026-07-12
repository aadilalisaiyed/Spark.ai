import pool from "../../config/db.js";

/**
 * Fetch all CSR activities.
 */
export async function getAllActivities() {
  const result = await pool.query(`
    SELECT id, title,
           joined_count AS "participantCount",
           evidence_required AS "evidenceRequired",
           status,
           50 AS points,
           'Join this CSR activity to contribute to the environment.' AS description,
           created_at AS "createdAt"
    FROM csr_activities
    ORDER BY created_at DESC
  `);

  return result.rows;
}

/**
 * Join an activity — insert a participation row with status 'Pending'.
 */
export async function joinActivity(activityId: string, employeeId: string, employeeName: string) {
  // Verify the activity exists
  const activityCheck = await pool.query(
    `SELECT id, title FROM csr_activities WHERE id = $1`,
    [activityId]
  );

  if (activityCheck.rows.length === 0) {
    return { notFound: true };
  }

  // Check if already joined
  const existing = await pool.query(
    `SELECT id FROM employee_participation
     WHERE activity_id = $1 AND employee_id = $2`,
    [activityId, employeeId]
  );

  if (existing.rows.length > 0) {
    return { duplicate: true };
  }

  const result = await pool.query(
    `INSERT INTO employee_participation (employee_id, employee_name, activity_id, approval_status, completion_date)
     VALUES ($1, $2, $3, 'Pending', NOW())
     RETURNING id, employee_id AS "employeeId", employee_name AS "employeeName",
               activity_id AS "activityId", approval_status AS "status", created_at AS "createdAt"`,
    [employeeId, employeeName, activityId]
  );

  // Increment joined count on the activity
  await pool.query(
    `UPDATE csr_activities
     SET joined_count = COALESCE(joined_count, 0) + 1
     WHERE id = $1`,
    [activityId]
  );

  return { data: result.rows[0] };
}

/**
 * Fetch all pending participation approvals.
 */
export async function getPendingApprovals() {
  const result = await pool.query(`
    SELECT ep.id,
           ep.employee_id AS "employeeId",
           ep.employee_name AS "employeeName",
           ep.activity_id AS "activityId",
           ca.title AS "activityTitle",
           ep.proof_url AS "proof",
           ep.points_earned AS "points",
           ep.approval_status AS "status",
           ep.created_at AS "submittedAt"
    FROM employee_participation ep
    JOIN csr_activities ca ON ca.id = ep.activity_id
    WHERE ep.approval_status = 'Pending'
    ORDER BY ep.created_at DESC
  `);

  return result.rows;
}

/**
 * Approve or reject a participation.
 * If requireEvidenceForCSR is true in settings, verify proof exists before approving.
 */
export async function updateApproval(
  participationId: string,
  data: { approvalStatus: string; pointsAwarded: number }
) {
  // 1. Check if requireEvidenceForCSR is enabled
  const settingsResult = await pool.query(
    `SELECT require_evidence_for_csr FROM system_settings LIMIT 1`
  );
  const requireEvidence = settingsResult.rows[0]?.require_evidence_for_csr === true;

  // 2. If approving and evidence is required, verify proof file link exists
  if (requireEvidence && data.approvalStatus === "Approved") {
    const participation = await pool.query(
      `SELECT proof_url FROM employee_participation WHERE id = $1`,
      [participationId]
    );

    if (participation.rows.length === 0) {
      return { notFound: true };
    }

    const proof = participation.rows[0].proof_url;
    if (!proof || proof.trim() === "") {
      return {
        evidenceMissing: true,
        message:
          "Cannot approve: 'requireEvidenceForCSR' is enabled and this participation has no proof file attached.",
      };
    }
  }

  // 3. Update the participation status and points
  const result = await pool.query(
    `UPDATE employee_participation
     SET approval_status = $1,
         points_earned = $2
     WHERE id = $3
     RETURNING id, employee_id AS "employeeId", activity_id AS "activityId",
               approval_status AS "status", points_earned AS "points",
               proof_url AS "proof", created_at AS "submittedAt"`,
    [data.approvalStatus, data.pointsAwarded, participationId]
  );

  if (result.rows.length === 0) {
    return { notFound: true };
  }

  return { data: result.rows[0] };
}
