import { Router } from "express";
import getRecommendations from "../controllers/moviesPublicPage/getRecommendations.js";
import getPopularMovies from "../controllers/moviesPublicPage/getPopularMovies.js";
import getMoviesByPage from "../controllers/moviesPublicPage/getMoviesByPage.js";
import searchMovies from "../controllers/moviesPublicPage/searchMovies.js";
import getVideoKey from "../controllers/moviesPublicPage/getVideoKey.js";
import getMovieById from "../controllers/moviesPublicPage/getMovieById.js";


const router = Router();

router.post("/get-recommendations", getRecommendations);

router.get("/get-popular-movies", getPopularMovies);

router.get("/get-movies-by-page", getMoviesByPage);

router.get("/search-movies", searchMovies);

router.get("/get-video-key/:movieId", getVideoKey);

router.get("/get-movie/:tmdb_id", getMovieById);

export default router;


