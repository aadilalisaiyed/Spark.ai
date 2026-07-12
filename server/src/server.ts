import app from "./app.js";
import { verifyDatabaseConnection } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  console.log("🚀 Starting Spark.ai ESG server...");

  // 1. Connect and verify PostgreSQL before starting the server
  await verifyDatabaseConnection();

  // 2. Listen on Port
  app.listen(PORT, () => {
    console.log(`📡 Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("❌ Fatal server crash during startup:", error);
  process.exit(1);
});
