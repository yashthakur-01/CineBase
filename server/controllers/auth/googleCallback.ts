import { Request, Response } from "express";
import { generateToken } from "../../lib/jwt.js";

const googleCallback = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
            });
        }

        const user = req.user as any;
        const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

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
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const redirectTo = `${clientOrigin}/home`;

        // Some browsers can drop Set-Cookie on cross-site redirect chains.
        // Return a tiny HTML page that navigates after the cookie is written.
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).send(`<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="refresh" content="0;url=${redirectTo}" />
        <title>Redirecting...</title>
    </head>
    <body>
        <script>
            window.location.replace(${JSON.stringify(redirectTo)});
        </script>
    </body>
</html>`);
    } catch (error) {
        console.error("Google callback error:", error);
        const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
        return res.redirect(`${clientOrigin}/auth`);

    }
};

export default googleCallback;
