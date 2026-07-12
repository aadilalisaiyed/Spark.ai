import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async route handler so that any thrown error
 * is automatically forwarded to the Express error handler.
 *
 * Usage: router.get("/path", asyncHandler(myController));
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
