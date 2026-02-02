import { Request, Response, NextFunction } from "express";
import { verifyToken, extractToken } from "../lib/jwt.js";
import { User } from "../models/userModel.js";

// Extend Express Request to include our custom user properties
declare global {
  namespace Express {
    interface User {
      id?: string;
      _id?: any;
      email: string;
      name?: string;
    }
  }
}

// Custom interface for our authenticated user
export interface AuthUser {
  id?: string;
  email: string;
  name?: string;
}

// Middleware to protect routes - requires authentication
export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from cookie or Authorization header
    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = extractToken(req.headers.authorization);
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Middleware to redirect authenticated users away from auth pages
export const redirectIfAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenFromCookie = req.cookies?.token;
    const tokenFromHeader = extractToken(req.headers.authorization);
    const token = tokenFromCookie || tokenFromHeader;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        return res.status(400).json({
          success: false,
          message: "Already authenticated",
          user: {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
          },
        });
      }
    }

    next();
  } catch (error) {
    // If token verification fails, allow access to auth routes
    next();
  }
};
