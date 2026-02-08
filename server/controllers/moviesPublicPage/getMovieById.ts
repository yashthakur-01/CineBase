import { Request, Response } from 'express';
import { MoviesModel } from '../../models/movieModel.js';

const getMovieById = async (req: Request, res: Response) => {
    try {
        const { tmdb_id } = req.params;

        if (!tmdb_id) {
            return res.status(400).json({ success: false, message: "No tmdb_id provided" });
        }

        const movie = await MoviesModel.findOne({ tmdb_id: Number(tmdb_id) });

        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        return res.status(200).json({ success: true, message: "Movie fetched successfully", movie });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        console.log(error);
    }
}

export default getMovieById;
