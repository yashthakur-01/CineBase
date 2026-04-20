import {Document} from "@langchain/core/documents";
import { querySimilarDocuments } from "../lib/vectorStore.js";
import { Types } from "mongoose";

const movieRetriever = async(document: Document,k: number=13)=>{

    const recommendations = await querySimilarDocuments(document, k + 1);

    const current_id = document.metadata?.mongo_id?.toString();
    const recommended_ids = recommendations
        .map((match) => match.metadata?.mongo_id || match.id)
        .filter(Boolean)
        .filter((id) => id !== current_id)
        .map((id) => new Types.ObjectId(id));

    return recommended_ids;
}

export default movieRetriever;
