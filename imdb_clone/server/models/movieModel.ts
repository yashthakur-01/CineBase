import mongoose, { Schema } from "mongoose";
import {Types} from "mongoose";

export interface Movie extends Document {
    _id? : Types.ObjectId
    original_title: string
    original_language: string
    tmdb_id: number
    adult: boolean
    genres: string[]
    release_date: Date
    actors: string[]
    directing: string[]
    overview: string
    popularity: number
    poster_path: string
    runtime: number
    tagline: string
    vote_average: number
    vote_count: number
    revenue: number
    isEmbedded: boolean
}


export const MoviesSchema: Schema<Movie> = new Schema({

    original_title: {
        type: String,
        required: true,
        trim: true,
    },

    original_language: {
        type: String,
        required: true,
    },

    tmdb_id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },

    adult: {
        type: Boolean,
        default: false,
    },

    genres: {
        type: [String],
        default: [],
    },

    release_date: {
        type: Date,
    },

    actors: {
        type: [String],
        default: [],
    },

    directing: {
        type: [String],
        default: [],
    },

    overview: {
        type: String,
    },

    popularity: {
        type: Number,
    },

    poster_path: {
        type: String,
    },

    runtime: {
        type: Number,
    },

    tagline: {
        type: String,
    },

    vote_average: {
        type: Number,
    },

    vote_count: {
        type: Number,
    },

    revenue: {
        type: Number,
    },
    
    isEmbedded: {
        type: Boolean,
    }
},
    {
        timestamps: true,
    }

)

export const MoviesModel = mongoose.model<Movie>("movies",MoviesSchema)