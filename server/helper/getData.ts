import { Movie } from "../models/movieModel.js";


const extractMovie = function (res1: any, res2: any): Movie {
  const actors = res2.cast
    .slice(0, 10) // optional: top 10 actors
    .map((actor: any) => actor.name);

  const directing = res2.crew
    ?.filter((member: any) => member.job === "Director")
    .map((director: any) => director.name) || [];

  return ({
    original_title: res1.original_title,
    original_language: res1.original_language,
    tmdb_id: res1.id,
    adult: res1.adult,

    genres: res1.genres.map((g: any) => g.name),

    release_date: new Date(res1.release_date),

    actors,
    directing,

    overview: res1.overview,
    popularity: res1.popularity,
    poster_path: res1.poster_path,
    runtime: res1.runtime,
    tagline: res1.tagline,
    vote_average: res1.vote_average,
    vote_count: res1.vote_count,
    revenue: res1.revenue,
  })as Movie;
}

export default extractMovie;