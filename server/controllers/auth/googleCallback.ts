import { Request, Response } from "express";
import { generateToken } from "../../lib/jwt.js";
import { authenticate } from "passport";

const googleCallback = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
            });
        }

        const user = req.user as any;

        // Generate JWT token
        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect to frontend home page
        return res.redirect(`${process.env.CLIENT_ORIGIN}/Home`);
    } catch (error) {
        console.error("Google callback error:", error);
        return res.redirect(`${process.env.CLIENT_ORIGIN}/Auth`);

    }
};

export default googleCallback;
