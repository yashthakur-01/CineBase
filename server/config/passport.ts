import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { UserModel } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Google Strategy for Google OAuth
passport.use(
    "google",
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails } = profile;
                const email = emails?.[0]?.value;

                if (!email) {
                    return done(null, false, { message: "Email not provided by Google" });
                }

                let user = await UserModel.findOne({ email });

                if (!user) {
                    user = await UserModel.create({
                        name: displayName,
                        email,
                        googleId: id,
                    });
                } else if (!user.googleId) {
                    // Link Google account to existing user
                    user.googleId = id;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user for sessions
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

// Deserialize user from sessions
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
