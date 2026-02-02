import { Document } from "@langchain/core/documents";
import vectorStore from "../lib/vectorStore.js";
import { Types } from "mongoose";
import { MoviesModel } from "../models/movieModel.js";


const embedData = async (docs: Document[]) => {
    let embeddedDocs: Types.ObjectId[] = [];
    try {
        console.log("length of docs: ", docs.length);
        if(docs.length>0){
            const embedded_vectors = await vectorStore.addDocuments(docs as Document[]);
        }

        const save_ids = docs.map((doc) => doc?.metadata?.mongo_id).filter(Boolean).map(id => new Types.ObjectId(id))

        if (save_ids.length > 0) {
            await MoviesModel.updateMany(
                { _id: { $in: save_ids } },
                { $set: { isEmbedded: true } }
            )
        }
        embeddedDocs = save_ids;
        console.log("length of embeddings: ", save_ids.length);
    } catch (error) {
        if (error instanceof Error) {
            throw Error(error.message);
        }
    } finally {
        return embeddedDocs;
    }
}

export default embedData;