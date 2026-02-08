import {Request,Response} from "express";
import {MoviesModel} from "../../models/movieModel.js"

const getMovies = async(req: Request, res: Response)=>{
    const limit = parseInt(req.query.limit as string) || 10;
    try {

        const movies = await MoviesModel.aggregate([
            {$sort: {popularity: -1}},
            {$limit: limit},
            {$sample: {size: 10}}
        ])

        if(!movies) return res.status(500).json({success:false,message:"unable to fetch popular movies"});

        return res.status(200).json({success:true,message:`Popular movies fetched successfully`,movies});
        
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({success:false,message:`Unexpected error occured: ${error.message}`});
        }
        console.log(error);
    }
}

export default getMovies;