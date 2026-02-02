import { Request,Response } from "express";
import { MoviesModel } from "../../models/movieModel.js";
import convertDocs from "../../helper/convertDocs.js";
import movieRetriever from "../../helper/movieRetriever.js";


const getRecommendations = async(req:Request,res:Response)=>{
    const {id,k} = req.body;
    if(!id) return res.status(400).json({success:false,message:"please provide movie_id"});
    try {
        const movie = await MoviesModel.findOne({tmdb_id:id});
        if(!movie) res.status(404).json({success:false,message:"movie with movie_id doesnot exist"});

        const docs = convertDocs([movie!]);

        const recommended_ids = await movieRetriever(docs[0],parseInt(k));

        const recommendations = await MoviesModel.find(
            {_id: {$in:recommended_ids}}
        )

        if(!recommendations) return res.status(500).json({success:false,message:"unable to generate Recommendations."});

        return res.status(200).json({success:true,message:"Movie Recommendations generated successfully",recommendations});

    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({success:false,message:`unexpected error occured: ${error.message}`});
        }
        console.log(error);
    }

}

export default getRecommendations;