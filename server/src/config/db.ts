import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error(
    "❌ FATAL: DATABASE_URL is not set in environment variables.\n" +
      "   → Copy .env.template to .env and paste your Neon connection string."
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Log pool-level errors (e.g. idle client disconnect)
pool.on("error", (err) => {
  console.error("⚠️  Unexpected database pool error:", err.message);
});

/**
 * Verify Neon connection at server boot.
 * Runs `SELECT NOW()` and automatically ensures `goals` and `system_settings` tables exist.
 */
export async function verifyDatabaseConnection(): Promise<void> {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");
    const serverTime = result.rows[0].server_time;
    console.log(`✅ Neon PostgreSQL connected — Server time: ${serverTime}`);

    // Create system_settings table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        auto_emission_calculation BOOLEAN DEFAULT TRUE,
        require_evidence_for_csr BOOLEAN DEFAULT FALSE,
        auto_badge_award BOOLEAN DEFAULT TRUE,
        email_alerts BOOLEAN DEFAULT TRUE,
        weight_environmental NUMERIC DEFAULT 0.33,
        weight_social NUMERIC DEFAULT 0.33,
        weight_governance NUMERIC DEFAULT 0.34,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Seed default settings row if table is empty
    await pool.query(`
      INSERT INTO system_settings (
        auto_emission_calculation,
        require_evidence_for_csr,
        auto_badge_award,
        email_alerts,
        weight_environmental,
        weight_social,
        weight_governance
      )
      SELECT true, false, true, true, 0.33, 0.33, 0.34
      WHERE NOT EXISTS (SELECT 1 FROM system_settings)
    `);

    // Create goals table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        target_co2 NUMERIC NOT NULL,
        current_co2 NUMERIC DEFAULT 0,
        progress NUMERIC DEFAULT 0,
        deadline DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("✅ Database tables verified and initialized successfully.");
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown connection error";
    console.error(`❌ Failed to connect or initialize Neon PostgreSQL: ${message}`);
    console.error(
      "   → Check your DATABASE_URL in .env and ensure Neon project is active."
    );
    process.exit(1);
  }
}

export default pool;
