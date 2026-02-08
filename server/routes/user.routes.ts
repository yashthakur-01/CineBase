import { Router } from "express";
import getWatchlist from "../controllers/watchlist/getWatchlist.js";
import addToWatchlist from "../controllers/watchlist/addToWatchlist.js";
import removeFromWatchlist from "../controllers/watchlist/removeFromWatchlist.js";
import { middleware } from "../middlewares/auth.middleware.js";
const router = Router();

// Apply auth middleware to all user routes
router.use(middleware);

router.post("/get-watchlist", getWatchlist);

router.post("/add-to-watchlist", addToWatchlist);

router.post("/remove-from-watchlist", removeFromWatchlist);

export default router;