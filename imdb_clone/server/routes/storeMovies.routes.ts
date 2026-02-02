import {Router} from "express"
import storeMovies from "../controllers/MovieStorage/storeMovies.js";
import generateEmbeddings from "../controllers/MovieStorage/generateEmbeddings.js";
const router = Router();

router.get("/store-movies/:page", storeMovies);

router.get("/generate-embeddings", generateEmbeddings);

export default router;