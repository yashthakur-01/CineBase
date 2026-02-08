import { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import extractMovie from "../../helper/getData.js";
import { Movie, MoviesModel } from "../../models/movieModel.js";


const storeMovies = async (req: Request, res: Response) => {
    const page = req.params.page as string;
    if (!page) {
        return res.status(400).json({ success: false, message: "Didn't get page number" });
    }
    try {
        const start = ((parseInt(page) - 1) * 20) + 1;
        let movie_list = [];
        for (let i = start; i < start + 20; i++) {
            try {
                const detail_url = `https://api.themoviedb.org/3/movie/${i}?language=en-US&api_key=${process.env.TMDB_API!}`;
                const credit_url = `https://api.themoviedb.org/3/movie/${i}/credits?language=en-US&api_key=${process.env.TMDB_API!}`;

                const res1 = await axios.get(detail_url);
                const res2 = await axios.get(credit_url);


                if (res1 && res2) {
                    const movie = extractMovie(res1.data, res2.data);

                    // Use upsert to avoid duplicate key errors
                    const saved_movie = await MoviesModel.findOneAndUpdate(
                        { tmdb_id: movie.tmdb_id },
                        movie,
                        { upsert: true, new: true }
                    );
                    movie_list.push(saved_movie);
                }

            } catch (error: any) {
                // Skip if movie not found (404) or any other error
                if (error.response?.status === 404) {
                    console.log(`Movie ID ${i} not found, skipping...`);
                    continue;
                }
                console.log(`Error fetching movie ID ${i}:`, error.message);
                continue;
            }
        }

        return res.status(200).json({ success: true, message: "movies saved successfully", movies: movie_list })


    } catch (error: any) {
        console.log(error);
        return res.json({ success: false, message: error.message }).status(500);
    }
}

export default storeMovies;