import { Request, Response } from "express";
import { UserModel } from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../lib/jwt.js";

interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body as SignUpRequest;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = generateToken({
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
        });

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Sign up error:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};

export default signUp;