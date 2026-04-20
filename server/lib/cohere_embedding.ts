import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

const COHERE_MODEL = "embed-v4.0";
const OUTPUT_DIMENSION = 1024;
const BATCH_SIZE = 48;

const apiKey = process.env.COHERE_API?.trim();
if (!apiKey) {
    throw new Error("Missing required environment variable: COHERE_API");
}

const client = new CohereClient({ token: apiKey });

const getFloatEmbeddings = (response: { embeddings?: { float?: number[][] } }) => {
    const vectors = response.embeddings?.float;
    if (!vectors || vectors.length === 0) {
        throw new Error("Cohere response did not include float embeddings");
    }
    return vectors;
};

const embedBatch = async (texts: string[], inputType: "search_document" | "search_query") => {
    const response = await client.v2.embed({
        model: COHERE_MODEL,
        texts,
        inputType,
        embeddingTypes: ["float"],
        outputDimension: OUTPUT_DIMENSION,
    });

    return getFloatEmbeddings(response);
};

const embeddings = {
    async embedDocuments(texts: string[]) {
        if (texts.length === 0) {
            return [];
        }

        const vectors: number[][] = [];
        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batch = texts.slice(i, i + BATCH_SIZE);
            const batchVectors = await embedBatch(batch, "search_document");
            vectors.push(...batchVectors);
        }

        return vectors;
    },

    async embedQuery(text: string) {
        const [vector] = await embedBatch([text], "search_query");
        return vector;
    },
};

export default embeddings;