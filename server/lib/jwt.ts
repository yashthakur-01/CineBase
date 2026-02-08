import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export interface JWTPayload {
    id: string;
    email: string;
    name: string;
}

export const generateToken = (payload: JWTPayload): string => {
    const options: SignOptions = { expiresIn: JWT_EXPIRE as jwt.SignOptions["expiresIn"] };
    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

export const extractToken = (authHeader: string | undefined): string | null => {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        return parts[1];
    }
    return null;
};
