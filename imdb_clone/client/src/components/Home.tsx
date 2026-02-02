import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LogOut,
  LogIn,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  Plus,
  Play,
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
}

function Home() {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [movieLoading, setMovieLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const getPopularMovies = async () => {
    try {
      setCarouselLoading(true);
      const res = await axios.get(`${API_BASE}/public/get-popular-movies`);
      if (res.data.success && res.data.movies) {
        setPopularMovies(res.data.movies);
      } else {
        toast.error(res.data.message || "Unable to fetch popular movies");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            "Unexpected error occurred fetching movies",
        );
      }
    } finally {
      setCarouselLoading(false);
    }
  };

  const getMovies = async (pageNum: number) => {
    try {
      setMovieLoading(true);
      const res = await axios.get(
        `${API_BASE}/public/get-movies-by-page?page=${pageNum}&limit=12`,
      );
      if (res.data.success && res.data.movies) {
        setMovies(res.data.movies);
      } else {
        toast.error(res.data.message || "Unable to fetch movies");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            "Unexpected error occurred fetching movies",
        );
        console.log(error);
      }
    } finally {
      setMovieLoading(false);
    }
  };

  useEffect(() => {
    getPopularMovies();
    getMovies(1);
  }, []);

  useEffect(() => {
    getMovies(page);
  }, [page]);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (popularMovies.length === 0) return;
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % popularMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [popularMovies.length]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const addToWatchlist = async (movieId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to watchlist");
      navigate("/");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/user/add-to-watchlist`,
        { movieId, user: { email: user?.email } },
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success("Search functionality coming soon");
      // TODO: Implement search functionality
    }
  };

  const nextCarouselSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % popularMovies.length);
  };

  const prevCarouselSlide = () => {
    setCarouselIndex((prev) =>
      prev === 0 ? popularMovies.length - 1 : prev - 1,
    );
  };

  const currentMovie = popularMovies[carouselIndex];

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
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CB</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:inline">
                CineBase
              </span>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-4"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors"
                >
                  {<Search size={18} />}
                </button>
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-10">
              {/* Watchlist Button */}
              {isAuthenticated && (
                <button
                  onClick={() => navigate("/watchlist")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors border border-slate-700 hover:border-purple-500"
                >
                  <Bookmark size={18} />
                  <span className="hidden sm:inline">Watchlist</span>
                </button>
              )}

              {/* Auth Actions */}
              {isAuthenticated ? (
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-sm text-slate-300">Welcome</span>
                    <span className="text-xs text-purple-400 font-semibold">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-red-600/50"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-600/50"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="submit"
                aria-label="Search movies"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-500"
              >
                {<Search size={18} />}
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Featured Carousel */}
      {carouselLoading ? (
        <div className="relative h-80 max-w-[90%] mx-auto bg-slate-800 flex items-center justify-center rounded-lg mt-6">
          <Loader2 className="animate-spin text-purple-500" size={48} />
        </div>
      ) : currentMovie ? (
        <div className="relative h-80 md:h-96 lg:h-[28rem] max-w-[90%] mx-auto mt-6 rounded-lg overflow-hidden group">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
            style={{
              backgroundImage: `url(${TMDB_IMAGE_BASE}/w780${currentMovie.poster_path})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/50 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-4 sm:px-8 md:px-12">
            <div className="max-w-xl">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                {currentMovie.original_title}
              </h1>

              {/* Movie Info */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {currentMovie.vote_average && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-yellow-400 font-semibold text-sm">
                      {currentMovie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
                {currentMovie.release_date && (
                  <span className="text-slate-300 text-sm">
                    {new Date(currentMovie.release_date).getFullYear()}
                  </span>
                )}
                {currentMovie.genres && currentMovie.genres.length > 0 && (
                  <div className="flex gap-2">
                    {currentMovie.genres.slice(0, 2).map((g, i) => (
                      <span
                        key={i}
                        className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded border border-purple-500/30"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-purple-600/50">
                  <Play size={20} fill="currentColor" />
                  Watch Now
                </button>
                {isAuthenticated && (
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg font-semibold transition-all border border-slate-600 hover:border-purple-500">
                    <Bookmark size={20} />
                    Add to Watchlist
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevCarouselSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            {<ChevronLeft size={28} />}
          </button>
          <button
            onClick={nextCarouselSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            {<ChevronRight size={28} />}
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {popularMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCarouselIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === carouselIndex
                    ? "bg-purple-500 w-6"
                    : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Movies Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Popular Movies
          </h2>
          <div className="h-1 w-20 bg-linear-to-r from-purple-600 to-blue-600 rounded-full"></div>
        </div>

        {/* Movies Grid */}
        {movieLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-purple-500" size={48} />
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="group cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  {/* Movie Card */}
                  <div className="relative overflow-hidden rounded-lg shadow-lg bg-slate-700/50 border border-slate-600/50">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={`${TMDB_IMAGE_BASE}/w342${movie.poster_path}`}
                        alt={movie.original_title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                        {/* Rating */}
                        {movie.vote_average && (
                          <div className="flex items-center gap-1 bg-yellow-500/80 px-2 py-1 rounded w-fit">
                            <Star
                              size={12}
                              className="text-yellow-300 fill-yellow-300"
                            />
                            <span className="text-xs font-semibold text-white">
                              {movie.vote_average.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => addToWatchlist(movie._id!)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-semibold rounded transition-all"
                          >
                            <Plus size={14} />
                            Add to Watchlist
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">
                        {movie.original_title}
                      </h3>
                      {movie.release_date && (
                        <p className="text-slate-400 text-xs mt-1">
                          {new Date(movie.release_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg border border-slate-700 hover:border-purple-500 transition-all"
              >
                {<ChevronLeft size={20} />}
              </button>

              <span className="text-white font-semibold">Page {page}</span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={movies.length < 12}
                aria-label="Next page"
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg border border-slate-700 hover:border-purple-500 transition-all"
              >
                {<ChevronRight size={20} />}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No movies found</p>
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

export default Home;
