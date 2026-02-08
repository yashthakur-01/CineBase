import { Request, Response } from 'express';
import { MoviesModel } from '../../models/movieModel.js';

const searchMovies = async (req: Request, res: Response) => {
    try {
        const { search, skip, limit } = req.query;

        if (!search) return res.status(400).json({ success: false, message: "No search query" });
        const parsedSkip = Number.isNaN(Number(skip)) ? 0 : Math.max(0, Number(skip));
        const parsedLimit = Number.isNaN(Number(limit)) ? 6 : Math.max(1, Number(limit));

        const movies = await MoviesModel.find({
            $text: { $search: search as string }
        })
            .sort({ popularity: -1 })
            .skip(parsedSkip)
            .limit(parsedLimit);

        if (!movies) return res.status(404).json({ success: false, message: "No movies found" });
        return res.status(200).json({ success: true, message: "movies fetched successfully", data: movies });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        console.log(error);
    }
}

export default searchMovies;