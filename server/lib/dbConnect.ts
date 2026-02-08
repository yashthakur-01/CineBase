import mongoose from "mongoose";

const dbConnect = async ()=>{
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI as string);

        if(conn){
            console.log("Database connected successfully");
        }

    } catch (error) {
        if(error instanceof Error){
            console.log("Error occured connecting with database");
            console.log(error);
        }
    }
}

export default dbConnect;