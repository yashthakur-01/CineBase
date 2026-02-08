import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Star,
    Clock,
    Calendar,
    Users,
    Film,
    Bookmark,
    Play,
    Loader2,
    TrendingUp,
    Sparkles,
} from "lucide-react";

const API_BASE = "http://localhost:3000/api";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

interface Movie {
    _id?: string;
    original_title: string;
    original_language: string;
    tmdb_id: number;
    adult: boolean;
    genres: string[];
    release_date: Date;
    actors: string[];
    directing: string[];
    overview: string;
    popularity: number;
    poster_path: string;
    runtime: number;
    tagline: string;
    vote_average: number;
    vote_count: number;
    revenue: number;
    isEmbedded: boolean;
    video_key?: string;
}

function MoviePage() {
    const { tmdb_id } = useParams<{ tmdb_id: string }>();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Get movie from navigation state or null
    const movieFromState = location.state?.movie as Movie | undefined;

    const [movie, setMovie] = useState<Movie | null>(movieFromState || null);
    const [loading, setLoading] = useState(!movieFromState);
    const [videoKey, setVideoKey] = useState<string | null>(movieFromState?.video_key || null);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    // Reset state when navigating to a new movie
    useEffect(() => {
        const newMovie = location.state?.movie as Movie | undefined;
        setMovie(newMovie || null);
        setVideoKey(newMovie?.video_key || null);
        setRecommendations([]);
        setLoading(!newMovie);
    }, [tmdb_id]);

    // Fetch movie details if not passed via state
    useEffect(() => {
        const fetchMovie = async () => {
            if (movie || !tmdb_id) return;

            try {
                setLoading(true);
                const res = await axios.get(
                    `${API_BASE}/public/get-movie/${tmdb_id}`
                );

                if (res.data.success && res.data.movie) {
                    setMovie(res.data.movie);
                    if (res.data.movie.video_key) {
                        setVideoKey(res.data.movie.video_key);
                    }
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message || "Failed to fetch movie");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [tmdb_id, movie]);

    // Fetch video key if not available
    const fetchVideoKey = async () => {
        if (!tmdb_id || videoKey) return;

        try {
            setLoadingVideo(true);
            const res = await axios.get(
                `${API_BASE}/public/get-video-key/${tmdb_id}`
            );

            if (res.data.success && res.data.movie?.video_key) {
                setVideoKey(res.data.movie.video_key);
                setMovie(res.data.movie);
            } else {
                toast.error("No trailer available for this movie");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Failed to fetch trailer");
            }
        } finally {
            setLoadingVideo(false);
        }
    };

    // Fetch recommendations
    const fetchRecommendations = async () => {
        if (!movie?.tmdb_id || recommendations.length > 0) return;

        try {
            setLoadingRecommendations(true);
            const res = await axios.post(`${API_BASE}/public/get-recommendations`, {
                id: movie.tmdb_id,
                k: 8
            });

            if (res.data.success && res.data.recommendations) {
                setRecommendations(res.data.recommendations);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Failed to fetch recommendations:", error.response?.data?.message);
            }
        } finally {
            setLoadingRecommendations(false);
        }
    };

    // Fetch recommendations when movie loads
    useEffect(() => {
        if (movie?.tmdb_id) {
            fetchRecommendations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movie?.tmdb_id]);

    const addToWatchlist = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to add to watchlist");
            navigate("/auth");
            return;
        }

        if (!movie?._id) return;

        try {
            const res = await axios.post(
                `${API_BASE}/user/add-to-watchlist`,
                { movieId: movie._id, user: { email: user?.email } },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message || "Added to watchlist!");
            } else {
                toast.error(res.data.message || "Failed to add to watchlist");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(
                    error.response?.data?.message || "Failed to add to watchlist"
                );
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500" size={64} />
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center gap-4">
                <p className="text-white text-xl">Movie not found</p>
                <button
                    onClick={() => navigate("/Home")}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Back Button & Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/Home")}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors border border-slate-700"
                            >
                                <ArrowLeft size={18} />
                                <span className="hidden sm:inline">Back</span>
                            </button>
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigate("/Home")}
                            >
                                <img
                                    src="/cine.jpg"
                                    alt="CineBase Logo"
                                    className="w-14 h-14 rounded-lg"
                                />
                                <span className="text-white font-bold text-xl hidden sm:inline">
                                    CineBase
                                </span>
                            </div>
                        </div>

                        {/* Add to Watchlist */}
                        <button
                            onClick={addToWatchlist}
                            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-600/50"
                        >
                            <Bookmark size={18} />
                            <span className="hidden sm:inline">Add to Watchlist</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Poster */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 flex justify-center lg:block">
                            <img
                                src={`${TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
                                alt={movie.original_title}
                                className="w-48 sm:w-56 md:w-64 lg:w-full max-w-xs lg:max-w-none rounded-xl shadow-2xl shadow-purple-900/30 border border-white/10"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Title & Tagline */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                                {movie.original_title}
                            </h1>
                            {movie.tagline && (
                                <p className="text-base sm:text-lg text-purple-300 italic">"{movie.tagline}"</p>
                            )}
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start">
                            {movie.vote_average && (
                                <div className="flex items-center gap-2 bg-yellow-500/30 px-3 py-2 rounded-lg border border-yellow-500/40">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-yellow-400 font-semibold">
                                        {movie.vote_average.toFixed(1)} / 10
                                    </span>
                                    <span className="text-slate-300 text-sm">
                                        ({movie.vote_count} votes)
                                    </span>
                                </div>
                            )}
                            {movie.release_date && (
                                <div className="flex items-center gap-2 bg-slate-700/70 px-3 py-2 rounded-lg border border-slate-500">
                                    <Calendar size={18} className="text-slate-300" />
                                    <span className="text-white font-medium">
                                        {new Date(movie.release_date).getFullYear()}
                                    </span>
                                </div>
                            )}
                            {movie.runtime > 0 && (
                                <div className="flex items-center gap-2 bg-slate-700/70 px-3 py-2 rounded-lg border border-slate-500">
                                    <Clock size={18} className="text-slate-300" />
                                    <span className="text-white font-medium">{movie.runtime} min</span>
                                </div>
                            )}
                            {movie.popularity && (
                                <div className="flex items-center gap-2 bg-slate-700/70 px-3 py-2 rounded-lg border border-slate-500">
                                    <TrendingUp size={18} className="text-green-400" />
                                    <span className="text-white font-medium">{movie.popularity.toFixed(0)} popularity</span>
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {movie.genres && movie.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                {movie.genres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-purple-600/40 text-purple-200 rounded-full border border-purple-400/50 text-sm font-medium"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                <Film size={20} className="text-purple-400" />
                                Overview
                            </h2>
                            <p className="text-slate-300 leading-relaxed">{movie.overview}</p>
                        </div>

                        {/* Cast & Crew */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Directors */}
                            {movie.directing && movie.directing.length > 0 && (
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                        <Users size={18} className="text-purple-400" />
                                        Directors
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.directing.slice(0, 5).map((director, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm"
                                            >
                                                {director}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actors */}
                            {movie.actors && movie.actors.length > 0 && (
                                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                        <Users size={18} className="text-purple-400" />
                                        Cast
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.actors.slice(0, 6).map((actor, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm"
                                            >
                                                {actor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Trailer Section */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Play size={20} className="text-purple-400" />
                                Trailer
                            </h2>

                            {videoKey ? (
                                <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${videoKey}`}
                                        title={`${movie.original_title} Trailer`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 gap-4">
                                    <p className="text-slate-400">Trailer not loaded yet</p>
                                    <button
                                        onClick={fetchVideoKey}
                                        disabled={loadingVideo}
                                        className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-600/50 disabled:opacity-50"
                                    >
                                        {loadingVideo ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <Play size={20} />
                                                Load Trailer
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recommendations Section */}
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-purple-400" />
                                Recommended Movies
                            </h2>

                            {loadingRecommendations ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="animate-spin text-purple-500" size={32} />
                                </div>
                            ) : recommendations.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                    {recommendations.map((rec) => (
                                        <div
                                            key={rec._id || rec.tmdb_id}
                                            className="group cursor-pointer"
                                            onClick={() => navigate(`/movie/${rec.tmdb_id}`, { state: { movie: rec } })}
                                        >
                                            <div className="relative overflow-hidden rounded-lg border border-slate-600/50 hover:border-purple-500/50 transition-all">
                                                <img
                                                    src={`${TMDB_IMAGE_BASE}/w342${rec.poster_path}`}
                                                    alt={rec.original_title}
                                                    className="w-full h-36 sm:h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                {rec.vote_average && (
                                                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500/90 px-2 py-0.5 rounded text-xs">
                                                        <Star size={10} className="text-yellow-200 fill-yellow-200" />
                                                        <span className="text-white font-semibold">
                                                            {rec.vote_average.toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <h3 className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                                                    {rec.original_title}
                                                </h3>
                                                <p className="text-xs text-slate-400">
                                                    {rec.release_date ? new Date(rec.release_date).getFullYear() : ""}
                                                    {rec.genres && rec.genres.length > 0 && ` • ${rec.genres[0]}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-center py-4">No recommendations available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-700/50 mt-5 py-8 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-400 text-sm">
                        © 2026 CineBase. All rights reserved. | Discover, Save & Enjoy
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default MoviePage;
