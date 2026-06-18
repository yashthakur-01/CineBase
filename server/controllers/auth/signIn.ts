import { Request, Response } from "express";
import { UserModel } from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../lib/jwt.js";

interface SignInRequest {
    email: string;
    password: string;
}

const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as SignInRequest;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check password
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

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

        return res.status(200).json({
            success: true,
            message: "Sign in successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Sign in error:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};

export default signIn;
