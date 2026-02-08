import mongoose from "mongoose";
import { Document } from "mongoose";

export interface User extends Document {
    name: string
    email: string
    password?: string
    createdAt: Date
    updatedAt: Date
    googleId?: string
    watchlist: mongoose.Schema.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    googleId: { type: String },
    watchlist: [
        { type: mongoose.Schema.Types.ObjectId }
    ]
}, { timestamps: true })

export const UserModel = mongoose.model<User>("users", userSchema);