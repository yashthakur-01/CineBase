import {Document} from "@langchain/core/documents";
import vectorStore from "../lib/vectorStore.js"
import { Types } from "mongoose";

const movieRetriever = async(document: Document,k: number=13)=>{

    const retriever = vectorStore.asRetriever({k:k+1});

    const recommendations = await retriever.invoke(document.pageContent);

    const current_id = document.metadata?.mongo_id?.toString();
    const recommended_ids = recommendations.map(doc=>doc.metadata.mongo_id).filter(Boolean).filter(id=>id!==current_id).map(id=>new Types.ObjectId(id));

    return recommended_ids;
}

export default movieRetriever;