import { Router } from "express";
import getRecommendations from "../controllers/moviesPublicPage/getRecommendations.js";
import getPopularMovies from "../controllers/moviesPublicPage/getPopularMovies.js";
import getMoviesByPage from "../controllers/moviesPublicPage/getMoviesByPage.js";


const router = Router();

router.post("/get-recommendations", getRecommendations);

router.get("/get-popular-movies", getPopularMovies);

router.get("/get-movies-by-page", getMoviesByPage);

export default router;


