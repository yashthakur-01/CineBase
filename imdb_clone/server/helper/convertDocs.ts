import {Movie} from "../models/movieModel.js";
import { Document } from "@langchain/core/documents";

const convertDocs = (movies: Movie[])=>{
    const docs = movies.map((movie)=>{

        const text = `{Movie title: ${movie.original_title},\n\nMovie release Date: ${movie.release_date},\n\nMovie language: ${movie.original_language},\n\nMovie genre: ${movie.genres},\n\nDescription: ${movie.overview},\n\nMovie Actors: ${movie.actors},\n\nMovie Director: ${movie.directing},\n\nIs movie adult: ${movie.adult}}`

        const metadata = {
            tmdb_id : movie.tmdb_id,
            mongo_id: movie._id?.toString()
        } 

        return new Document({
            pageContent: text,
            metadata
        })
    })

    return docs;
}

export default convertDocs;