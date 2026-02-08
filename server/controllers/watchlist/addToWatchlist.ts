import { Request, Response } from "express";
import { UserModel } from "../../models/userModel.js";

const addToWatchlist = async (req: Request, res: Response) => {
    const { user: {email}, movieId } = req.body;
    if (!email || !movieId) return res.status(400).json({ success: false, message: "User Not loggedin" });

    try {

        const result = await UserModel.updateOne(
            { email, watchlist: { $ne: movieId } },
            { $push: { watchlist: movieId } }
        );

        if (result.modifiedCount === 0) {
            return res.status(201).json({ success: true, message: "Already in watchlist" });
        }
        return res.status(201).json({ success: true, message: "Movie added into the watchlist" });

    } catch (error) {
        if (error instanceof Error) return res.status(500).json({ success: false, message: `server error occured: ${error.message}` });
        console.log(error);
    }

}

export default addToWatchlist;