import { Chroma } from "@langchain/community/vectorstores/chroma";
import embeddings from "./cohere_embedding.js";


const vectorStore = new Chroma(
    embeddings,{
        url: process.env.CHROMA_URL,
        collectionName: "movies" 
    }
)

export default vectorStore;