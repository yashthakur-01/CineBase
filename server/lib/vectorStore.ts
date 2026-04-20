import axios from "axios";
import { Document } from "@langchain/core/documents";
import embeddings from "./cohere_embedding.js";

type PineconeMetadata = {
    mongo_id: string;
    tmdb_id?: number;
};

type PineconeQueryMatch = {
    id: string;
    score?: number;
    metadata?: Partial<PineconeMetadata>;
};

const PINECONE_CONTROLLER_URL = "https://api.pinecone.io";
const PINECONE_API_VERSION = process.env.PINECONE_API_VERSION || "2025-10";

let cachedIndexHost: string | null = null;

const getRequiredEnv = (key: string) => {
    const value = process.env[key]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const normalizeHost = (host: string) =>
    host.replace(/^https?:\/\//, "").replace(/\/+$/, "");

const getHeaders = () => ({
    "Api-Key": getRequiredEnv("PINECONE_API_KEY"),
    "Content-Type": "application/json",
    "X-Pinecone-Api-Version": PINECONE_API_VERSION,
});

const getNamespace = () => process.env.PINECONE_NAMESPACE || "__default__";

const logAxiosError = (label: string, error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error(`[${label}] axios message:`, error.message);
        console.error(`[${label}] code:`, error.code);
        console.error(`[${label}] status:`, error.response?.status);
        console.error(`[${label}] response data:`, error.response?.data);
        return;
    }

    if (error instanceof Error) {
        console.error(`[${label}] error:`, error.message);
        return;
    }

    console.error(`[${label}] unknown error:`, error);
};

const getIndexHost = async () => {
    if (cachedIndexHost) {
        return cachedIndexHost;
    }

    const explicitHost = process.env.PINECONE_INDEX_HOST?.trim();
    if (explicitHost) {
        cachedIndexHost = normalizeHost(explicitHost);
        console.log("Using Pinecone host from PINECONE_INDEX_HOST");
        return cachedIndexHost;
    }

    const indexName = getRequiredEnv("PINECONE_INDEX_NAME");
    let response;
    try {
        response = await axios.get<{ host: string }>(
            `${PINECONE_CONTROLLER_URL}/indexes/${encodeURIComponent(indexName)}`,
            {
                headers: getHeaders(),
            }
        );
    } catch (error) {
        logAxiosError("pinecone-host-lookup", error);
        throw error;
    }

    if (!response.data?.host) {
        throw new Error(`Unable to resolve Pinecone host for index: ${indexName}`);
    }

    cachedIndexHost = normalizeHost(response.data.host);
    console.log("Resolved Pinecone host from controller");
    return cachedIndexHost;
};

const getMetadataFromDocument = (document: Document): PineconeMetadata => {
    const mongoId = document.metadata?.mongo_id?.toString();
    if (!mongoId) {
        throw new Error("Each embedded document must include metadata.mongo_id");
    }

    const tmdbId = document.metadata?.tmdb_id;

    return {
        mongo_id: mongoId,
        ...(typeof tmdbId === "number" ? { tmdb_id: tmdbId } : {}),
    };
};

const formatPineconeError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data || error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Unknown Pinecone error";
};

export const addDocumentsToVectorStore = async (documents: Document[]) => {
    if (documents.length === 0) {
        return 0;
    }

    try {
        const host = await getIndexHost();
        console.log("Embedding batch size:", documents.length, "namespace:", getNamespace());
        const vectors = await embeddings.embedDocuments(
            documents.map((document) => document.pageContent)
        );
        console.log("Embedded vector count:", vectors.length, "vector dimension:", vectors[0]?.length);

        const payload = {
            namespace: getNamespace(),
            vectors: documents.map((document, index) => ({
                id: getMetadataFromDocument(document).mongo_id,
                values: vectors[index],
                metadata: getMetadataFromDocument(document),
            })),
        };

        const response = await axios.post<{ upsertedCount?: number }>(
            `https://${host}/vectors/upsert`,
            payload,
            {
                headers: getHeaders(),
            }
        );

        return response.data?.upsertedCount ?? payload.vectors.length;
    } catch (error) {
        logAxiosError("pinecone-upsert", error);
        throw new Error(`Pinecone upsert failed: ${formatPineconeError(error)}`);
    }
};

export const querySimilarDocuments = async (
    document: Document,
    topK: number
) => {
    try {
        const host = await getIndexHost();
        console.log("Running similarity query", { topK, namespace: getNamespace() });
        const vector = await embeddings.embedQuery(document.pageContent);
        console.log("Query vector dimension:", vector.length);

        const response = await axios.post<{ matches?: PineconeQueryMatch[] }>(
            `https://${host}/query`,
            {
                namespace: getNamespace(),
                vector,
                topK,
                includeMetadata: true,
                includeValues: false,
            },
            {
                headers: getHeaders(),
            }
        );

        return response.data?.matches ?? [];
    } catch (error) {
        logAxiosError("pinecone-query", error);
        throw new Error(`Pinecone query failed: ${formatPineconeError(error)}`);
    }
};
