import { Request, Response } from "express";
import getTrailerKey from "../../helper/getTrailerKey.js";
import { MoviesModel } from "../../models/movieModel.js";

const getVideoKey = async (req: Request, res: Response) => {
    try {
        const { movieId } = req.params;
        const videoKey = await getTrailerKey(movieId as string);

        if (!videoKey) {
            return res.status(404).json({ success: false, message: "No video key found" });
        }

        const movie = await MoviesModel.findOneAndUpdate(
            { tmdb_id: Number(movieId) },
            { $set: { video_key: videoKey } },
            { new: true }
        )
        if (!movie) {
            return res.status(404).json({ success: false, message: "unable to update video key" });
        }
        res.json({ success: true, message: "video key updated successfully", movie });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        console.log(error);
    }
}

export default getVideoKey;