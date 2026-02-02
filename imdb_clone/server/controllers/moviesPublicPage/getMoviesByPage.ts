import {Request,Response} from "express";
import {MoviesModel} from "../../models/movieModel.js"

const getMoviesByPage = async(req: Request, res: Response)=>{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const skip = (page-1) * limit;
    try {

        const movies = await MoviesModel.find({}).skip(skip).limit(limit);

        if(!movies) return res.status(500).json({success:false,message:"unable to fetch movies"});

        return res.status(200).json({success:true,message:`movies fetched successfully`,movies});
        
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({success:false,message:`Unexpected error occured: ${error.message}`});
        }
        console.log(error);
    }
}

export default getMoviesByPage;