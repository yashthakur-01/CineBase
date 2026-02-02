import { Router } from "express";
import passport from "passport";
import signUp from "../controllers/auth/signup.js";
import signIn from "../controllers/auth/signIn.js";
import googleCallback from "../controllers/auth/googleCallback.js";
import logout from "../controllers/auth/logout.js";
import me from "../controllers/auth/me.js";
import { redirectIfAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// Custom authentication routes - redirect if already authenticated
router.post("/signup", redirectIfAuthenticated, signUp);
router.post("/signin", redirectIfAuthenticated, signIn);

// Logout and current user routes
router.post("/logout", logout);
router.get("/me", me);

// Google OAuth routes
router.get(
    "/google",
    redirectIfAuthenticated,
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/api/auth/google/failure",
        session: false,
    }),
    googleCallback
);

router.get("/google/failure", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Google authentication failed",
    });
});

export default router;
