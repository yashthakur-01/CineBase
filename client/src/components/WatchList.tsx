import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Star,
    Trash2,
    Bookmark,
    Loader2,
    Film,
    Clock,
    TrendingUp,
    Eye,
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

function WatchList() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Please sign in to view your watchlist");
            navigate("/auth");
        }
    }, [isAuthenticated, navigate]);

    // Fetch watchlist
    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!isAuthenticated || !user?.email) return;

            try {
                setLoading(true);
                const res = await axios.post(`${API_BASE}/user/get-watchlist`, {
                    user: { email: user.email },
                    withCredentials: true,
                });

                if (res.data.success && res.data.movies) {
                    setMovies(res.data.movies);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.status !== 201) {
                        toast.error(error.response?.data?.message || "Failed to fetch watchlist");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [isAuthenticated, user?.email]);

    const removeFromWatchlist = async (movieId: string) => {
        if (!user?.email) return;

        try {
            setRemovingId(movieId);
            const res = await axios.post(
                `${API_BASE}/user/remove-from-watchlist`,
                { movieId, user: { email: user.email } },
                { withCredentials: true }
            );

            if (res.data.success) {
                setMovies(movies.filter((m) => m._id !== movieId));
                toast.success("Removed from watchlist");
            } else {
                toast.error(res.data.message || "Failed to remove");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Failed to remove");
            }
        } finally {
            setRemovingId(null);
        }
    };

    if (!isAuthenticated) {
        return null;
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
                        <div className="flex items-center gap-2 text-white">
                            <Bookmark size={20} className="text-purple-400" />
                            <span className="font-semibold">My Watchlist</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Section Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                        My Watchlist
                    </h1>
                    <div className="h-1 w-20 bg-linear-to-r from-purple-600 to-blue-600 rounded-full"></div>
                    <p className="text-slate-400 mt-3">
                        {movies.length} movie{movies.length !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-purple-500" size={48} />
                    </div>
                ) : movies.length > 0 ? (
                    /* Movies Table */
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700 bg-slate-800/80">
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-slate-300">Movie</th>
                                        <th className="text-left py-4 px-3 text-sm font-semibold text-slate-300 hidden md:table-cell">Genres</th>
                                        <th className="text-center py-4 px-3 text-sm font-semibold text-slate-300">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star size={14} className="text-yellow-400" />
                                                Rating
                                            </div>
                                        </th>
                                        <th className="text-center py-4 px-3 text-sm font-semibold text-slate-300 hidden lg:table-cell">
                                            <div className="flex items-center justify-center gap-1">
                                                <TrendingUp size={14} className="text-green-400" />
                                                Popularity
                                            </div>
                                        </th>
                                        <th className="text-center py-4 px-3 text-sm font-semibold text-slate-300 hidden sm:table-cell">
                                            <div className="flex items-center justify-center gap-1">
                                                <Clock size={14} className="text-slate-400" />
                                                Runtime
                                            </div>
                                        </th>
                                        <th className="text-center py-4 px-3 text-sm font-semibold text-slate-300 hidden sm:table-cell">Year</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.map((movie, index) => (
                                        <tr
                                            key={movie._id}
                                            className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'
                                                }`}
                                        >
                                            {/* Movie Info */}
                                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <img
                                                        src={`${TMDB_IMAGE_BASE}/w92${movie.poster_path}`}
                                                        alt={movie.original_title}
                                                        className="w-10 h-14 sm:w-12 sm:h-18 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                                                        onClick={() => navigate(`/movie/${movie.tmdb_id}`, { state: { movie } })}
                                                    />
                                                    <div className="min-w-0">
                                                        <h3
                                                            className="text-white font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px] cursor-pointer hover:text-purple-400 transition-colors"
                                                            onClick={() => navigate(`/movie/${movie.tmdb_id}`, { state: { movie } })}
                                                        >
                                                            {movie.original_title}
                                                        </h3>
                                                        {movie.directing && movie.directing.length > 0 && (
                                                            <p className="text-xs text-slate-500 truncate max-w-[200px]">
                                                                {movie.directing[0]}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Genres */}
                                            <td className="py-3 px-3 hidden md:table-cell">
                                                <div className="flex flex-wrap gap-1">
                                                    {movie.genres && movie.genres.slice(0, 2).map((genre, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-0.5 bg-purple-600/20 text-purple-300 rounded text-xs"
                                                        >
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Rating */}
                                            <td className="py-3 px-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                    <span className="text-yellow-400 font-semibold">
                                                        {movie.vote_average?.toFixed(1) || "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Popularity */}
                                            <td className="py-3 px-3 text-center hidden lg:table-cell">
                                                <span className="text-green-400 font-medium">
                                                    {movie.popularity?.toFixed(0) || "N/A"}
                                                </span>
                                            </td>

                                            {/* Runtime */}
                                            <td className="py-3 px-3 text-center hidden sm:table-cell">
                                                <span className="text-slate-300">
                                                    {movie.runtime ? `${movie.runtime} min` : "N/A"}
                                                </span>
                                            </td>

                                            {/* Year */}
                                            <td className="py-3 px-3 text-center hidden sm:table-cell">
                                                <span className="text-slate-300">
                                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                    <button
                                                        onClick={() => navigate(`/movie/${movie.tmdb_id}`, { state: { movie } })}
                                                        className="p-2 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg transition-all border border-purple-500/30 hover:border-purple-500"
                                                        title="View details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromWatchlist(movie._id!)}
                                                        disabled={removingId === movie._id}
                                                        className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/30 hover:border-red-500 disabled:opacity-50"
                                                        title="Remove from watchlist"
                                                    >
                                                        {removingId === movie._id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Film size={64} className="text-slate-600" />
                        <h2 className="text-xl font-semibold text-white">
                            Your watchlist is empty
                        </h2>
                        <p className="text-slate-400 text-center max-w-md">
                            Start adding movies to your watchlist by clicking the "Add to
                            Watchlist" button on any movie page.
                        </p>
                        <button
                            onClick={() => navigate("/Home")}
                            className="mt-4 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-600/50"
                        >
                            Browse Movies
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-700/50 mt-20 py-8 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-400 text-sm">
                        © 2026 CineBase. All rights reserved. | Discover, Save & Enjoy
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default WatchList;
