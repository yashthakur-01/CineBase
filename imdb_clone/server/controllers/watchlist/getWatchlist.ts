import { Request, Response } from "express";
import { MoviesModel } from "../../models/movieModel.js"
import { UserModel } from "../../models/userModel.js";
import { Types } from "mongoose";

const getWatchlist = async (req: Request, res: Response) => {
    const {email} = req.body.user;    
    if (!email) return res.status(400).json({ success: false, message: "the user id must be passed" });

    try {

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) return res.status(404).json({ success: false, message: "the User doesnot exist" });

        if (existingUser.watchlist.length <= 0) return res.status(201).json({ success: true, message: "No movies added to the watchlist yet" });

        const watchlist = existingUser.watchlist.map((id) => new Types.ObjectId(id.toString()));

        const movies = await MoviesModel.find({
            _id: { $in: watchlist }
        });

        if (!movies) return res.status(500).json({ success: false, message: "error fetching movies in watchlist" });

        return res.status(200).json({ success: true, message: `movies fetched successfully`, movies: movies });

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: `Unexpected error occured: ${error.message}` });
        }
        console.log(error);
    }
}

export default getWatchlist;