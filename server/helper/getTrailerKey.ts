const API_KEY = process.env.TMDB_API;

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}



const getTrailerKey = async (movieId: string) => {
  try {
    console.log("Fetching trailer for movieId:", movieId);
    console.log("Using API_KEY:", API_KEY ? "Key is set" : "KEY IS UNDEFINED!");

    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;
    console.log("Fetching URL:", url.replace(API_KEY || '', '***'));

    const res = await fetch(url);
    const data = await res.json();

    console.log("API Response status:", res.status);
    console.log("API Response data:", JSON.stringify(data, null, 2));

    // Check if results exist
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      console.log("No video results found for movie:", movieId);
      return null;
    }

    console.log("Found", data.results.length, "videos");

    const priority = ["Trailer", "Teaser", "Clip", "Featurette"];

    // Find first matching video based on priority
    let video = null;
    for (const type of priority) {
      video = data.results.find(
        (v: Video) => v.site === "YouTube" && v.type === type
      );
      if (video) {
        console.log("Found matching video:", video.name, "type:", video.type, "key:", video.key);
        break;
      }
    }

    // If nothing matched, just return the first YouTube video
    if (!video) {
      video = data.results.find((v: Video) => v.site === "YouTube");
      if (video) {
        console.log("Using first YouTube video:", video.name, "key:", video.key);
      }
    }

    return video?.key || null;
  } catch (error) {
    console.error("Error fetching trailer key:", error);
    return null;
  }
};

export default getTrailerKey;