import { Request, Response } from "express";
import { UserModel } from "../../models/userModel.js";

const removeFromWatchlist = async (req: Request, res: Response) => {
    const { user:{email}, movieId } = req.body;
    if (!email || !movieId) return res.status(400).json({ success: false, message: "email/movieId not Provided" });

    try {

        const result = await UserModel.updateOne(
            { email , watchlist: movieId},
            { $pull: { watchlist: movieId } }
        );

        if (result.modifiedCount === 0) {
            return res.status(201).json({ success: true, message: "Movie already not in watchlist" });
        }
        return res.status(5201).json({ success: true, message: "Movie removed from the watchlist the watchlist" });

    } catch (error) {
        if (error instanceof Error) return res.status(500).json({ success: false, message: `server error occured: ${error.message}` });
        console.log(error);
    }

}

export default removeFromWatchlist;