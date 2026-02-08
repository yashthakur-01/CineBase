import { Auth } from "./components/Auth";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import MoviePage from "./components/MoviePage";
import WatchList from "./components/WatchList";
import { PublicRouteProps } from "./components/PublicRouteProps";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderRadius: "12px",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#fff",
            },
            style: {
              background:
                "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.08))",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              boxShadow:
                "0 8px 32px rgba(139, 92, 246, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#fff",
            },
            style: {
              background:
                "linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(239, 68, 68, 0.08))",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
            },
          },
        }}
      />
      <Routes>
        <Route
          path="auth"
          element={
            <PublicRouteProps>
              <Auth />
            </PublicRouteProps>
          }
        />

        <Route path="Home" element={<Home></Home>} />
        <Route path="movie/:tmdb_id" element={<MoviePage />} />
        <Route path="watchlist" element={<WatchList />} />
        {/* Example protected route - wrap any route that needs authentication */}
        {/* <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
