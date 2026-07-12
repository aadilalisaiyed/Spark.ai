import { Request, Response, NextFunction } from "express";

/**
 * Global async error handler middleware.
 * Catches all unhandled errors from route handlers and SQL queries,
 * returning a uniform JSON shape: { success: false, error: "..." }
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log full stack in development, message-only in production
  const isDev = process.env.NODE_ENV !== "production";

  console.error("─── Unhandled Error ───");
  console.error(isDev ? err.stack : err.message);
  console.error("───────────────────────");

  // Detect PostgreSQL-specific errors (from pg library)
  const pgError = err as any;
  if (pgError.code && typeof pgError.code === "string" && pgError.code.length === 5) {
    // PostgreSQL error codes are 5-character strings (e.g., "23505" for unique violation)
    const pgMessages: Record<string, string> = {
      "23505": "A record with that value already exists (duplicate key).",
      "23503": "Referenced record does not exist (foreign key violation).",
      "23502": "A required field is missing (not-null violation).",
      "42P01": "Database table not found. Please check your schema.",
      "42703": "Unknown column referenced in query.",
    };

    res.status(400).json({
      success: false,
      error: pgMessages[pgError.code] || `Database error (code: ${pgError.code}).`,
    });
    return;
  }

  // Generic server error
  res.status(500).json({
    success: false,
    error: isDev ? err.message : "Internal server error. Please try again later.",
  });
}
