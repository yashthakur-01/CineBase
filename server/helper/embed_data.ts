import { Document } from "@langchain/core/documents";
import vectorStore from "../lib/vectorStore.js";
import { Types } from "mongoose";
import { MoviesModel } from "../models/movieModel.js";


const embedData = async (docs: Document[]) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    let embeddedDocs: Types.ObjectId[] = [];
    try {
        console.log("length of docs: ", docs.length);
        let embedded_vectors: Types.ObjectId[] = []
        for (let i = 0; i < docs.length; i += 50) {
            console.log('iteration ', i);
            console.log("embedding movies from ", i, " to ", Math.min(i + 50, docs.length));

            const batchDocs = docs.slice(i, i + 50);
            await vectorStore.addDocuments(batchDocs);

            const save_ids = batchDocs.map((doc) => doc?.metadata?.mongo_id).filter(Boolean).map(id => new Types.ObjectId(id));
            if (save_ids.length > 0) {
                await MoviesModel.updateMany(
                    { _id: { $in: save_ids } },
                    { $set: { isEmbedded: true } }
                )
            }
            embedded_vectors.push(...save_ids);
            console.log("length of embeddings in this batch: ", save_ids.length);

            if (i + 50 < docs.length) {
                console.log("calling a 1 min timer")
                await delay(1000 * 20);
                console.log("timer ended")
            }
        }

        embeddedDocs = embedded_vectors;
        console.log("Total length of embeddings: ", embedded_vectors.length);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error embedding data:", error);
            throw Error(error.message);
        }
    } finally {
        return embeddedDocs;
    }
}

export default embedData;