import { Request, Response } from "express";
import { verifyToken, extractToken } from "../../lib/jwt.js";

const me = async (req: Request, res: Response) => {
    try {
        // Get token from cookie or header
        const tokenFromCookie = req.cookies?.token;
        const tokenFromHeader = extractToken(req.headers.authorization);
        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                authenticated: false,
                message: "Not authenticated",
            });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                authenticated: false,
                message: "Invalid or expired token",
            });
        }

        return res.status(200).json({
            success: true,
            authenticated: true,
            user: {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
            },
        });
    } catch (error) {
        console.error("Me endpoint error:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};

export default me;
