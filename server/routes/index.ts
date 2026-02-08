import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import publicRoutes from "./public.routes.js";
import storageRoutes from "./storeMovies.routes.js";
const router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/public", publicRoutes);

router.use("/store", storageRoutes);

export default router;


