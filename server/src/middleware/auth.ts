import type { Request, Response, NextFunction } from "express";

/**
 * Middleware to ensure user is authenticated
 * Checks if userId exists in session
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  next();
};

/**
 * Middleware to ensure user is authenticated and has admin role
 * Must be used after requireAuth or include auth check
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  if (req.session.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
};
