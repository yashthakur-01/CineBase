import {CohereEmbeddings} from "@langchain/cohere";
import dotenv from 'dotenv';

dotenv.config()


const embeddings = new CohereEmbeddings({
    model: 'embed-v4.0',
    apiKey: process.env.COHERE_API
});

export default embeddings;