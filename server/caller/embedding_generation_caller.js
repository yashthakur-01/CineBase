import axios from "axios";

const generateEmbeddings = async () => {
  try {
    const endpoint =
      process.env.EMBEDDING_ENDPOINT ||
      "http://localhost:3000/api/store/generate-embeddings";
    console.log("Generating embeddings for new movies...");
    console.log("Caller endpoint:", endpoint);
    const res = await axios.get(endpoint);

    console.log("Embeddings generated successfully");
    console.log(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error occurred:", error.message);
      console.log("Status:", error.response?.status);
      console.log("Response data:", error.response?.data);
      return;
    }

    if (error instanceof Error) {
      console.log("Error occurred:", error.message);
    }
  }
};

generateEmbeddings();
