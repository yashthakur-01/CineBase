import { MoviesModel } from "../../models/movieModel.js";
import convertDocs from "../../helper/convertDocs.js";
import embedData from "../../helper/embed_data.js";
import { Response, Request } from "express";

const generateEmbeddings = async (req: Request, res: Response) => {

    try {

        const movies = await MoviesModel.find({ isEmbedded: false });
        console.log("length of movies: ", movies.length);
        const docs = convertDocs(movies);
        console.log("length of docs: ", docs.length);
        const generatedVectors = await embedData(docs);
        let message = "";
        if (generatedVectors.length <= 0) message = "No vector embedded";
        else message = `${generatedVectors.length} vectors embedded successfully`
        return res.status(200).json({success:true,message,embedded_vectoe_ids:generatedVectors })

    } catch (error) {
        if (error instanceof Error) {
            console.log("error occured generating embeddings");
            return res.status(500).json({ success: false, message: error.message })
        }
        console.log(error);
    }

}

export default generateEmbeddings;