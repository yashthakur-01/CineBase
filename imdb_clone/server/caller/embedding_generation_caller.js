import axios from "axios";

const generateEmbeddings = async()=>{
    try {
        const res = await axios.get("http://localhost:3000/generate-embeddings");

        console.log("Embeddings generated successfully");
        console.log(res.data);
    } catch (error) {
        if(error instanceof Error){
            console.log("error occured: ", error);
            console.log("stack trace: ", error.stack);
        }
    }
}

generateEmbeddings();