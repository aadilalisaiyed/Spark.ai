import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import middlewares
import { errorHandler } from "./middleware/errorHandler.js";

// Import modular routers
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";
import environmentalRouter from "./modules/environmental/environmental.routes.js";
import socialRouter from "./modules/social/social.routes.js";
import governanceRouter from "./modules/governance/governance.routes.js";
import gamificationRouter from "./modules/gamification/gamification.routes.js";
import settingsRouter from "./modules/settings/settings.routes.js";

dotenv.config();

const app = express();

// 1. Core Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Health & Info Checks
app.get("/", (_req, res) => {
  res.json({
    message: "🌍 Welcome to the Spark.ai ESG Platform API server!",
    status: "online",
    endpoints: {
      health: "/health",
      dashboard: "/api/dashboard/scores",
      environmental: "/api/environmental/goals",
      social: "/api/social/activities",
      governance: "/api/governance/audits",
      gamification: "/api/gamification/leaderboard",
      settings: "/api/settings/configuration"
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "healthy", timestamp: new Date() });
});

// 3. Modular Routes
app.use("/api/dashboard", dashboardRouter);
app.use("/api/environmental", environmentalRouter);
app.use("/api/social", socialRouter);
app.use("/api/governance", governanceRouter);
app.use("/api/gamification", gamificationRouter);
app.use("/api/settings", settingsRouter);

// 4. Global Async Error Interceptor (must be registered last)
app.use(errorHandler);

export default app;
