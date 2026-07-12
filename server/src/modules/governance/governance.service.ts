import pool from "../../config/db.js";

/**
 * Fetch all audits joined with department names.
 */
export async function getAllAudits() {
  const result = await pool.query(`
    SELECT a.id, a.title,
           d.name AS department,
           a.auditor,
           a.audit_date AS "date",
           a.findings,
           a.status,
           a.created_at AS "createdAt"
    FROM audits a
    JOIN departments d ON d.id = a.department_id
    ORDER BY a.created_at DESC
  `);

  return result.rows;
}

/**
 * Create a new audit record.
 */
export async function createAudit(data: {
  title: string;
  departmentId: string;
  auditor: string;
  date: string;
  findings: string;
  status: string;
}) {
  const result = await pool.query(
    `INSERT INTO audits (title, department_id, auditor, audit_date, findings, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, department_id AS "departmentId", auditor, audit_date AS "date",
               findings, status, created_at AS "createdAt"`,
    [
      data.title,
      data.departmentId,
      data.auditor,
      data.date,
      data.findings,
      data.status || "Under Review",
    ]
  );

  return result.rows[0];
}

/**
 * Fetch all compliance issues joined with department names.
 */
export async function getAllComplianceIssues() {
  const result = await pool.query(`
    SELECT ci.id,
           ci.issue_description AS "issue",
           ci.severity,
           d.name AS department,
           ci.status,
           ci.audit_id AS "raisedFrom",
           ci.due_date AS "dueDate",
           ci.created_at AS "createdAt"
    FROM compliance_issues ci
    JOIN departments d ON d.id = ci.department_id
    ORDER BY
      CASE ci.severity
        WHEN 'High' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Low' THEN 3
      END,
      ci.created_at DESC
  `);

  return result.rows;
}

/**
 * Resolve a compliance issue — set status to 'Resolved'.
 */
export async function resolveComplianceIssue(issueId: string) {
  const result = await pool.query(
    `UPDATE compliance_issues
     SET status = 'Resolved'
     WHERE id = $1
     RETURNING id, issue_description AS "issue", severity, status,
               created_at AS "createdAt"`,
    [issueId]
  );

  if (result.rows.length === 0) {
    return { notFound: true };
  }

  return { data: result.rows[0] };
}
