import axios from "axios";

const generateEmbeddings = async () => {
    try {
        console.log("Generating embeddings for new movies...");
        const res = await axios.get("http://localhost:3000/api/store/generate-embeddings");

        console.log("Embeddings generated successfully");
        console.log(res.data);
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error occurred:", error.message);
        }
    }
}

generateEmbeddings();