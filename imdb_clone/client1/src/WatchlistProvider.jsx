import { createContext, useEffect, useState } from "react";
import Watchlist from "./components/Watchlist";
import { genres } from "./Genrelist";
export const watchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  let [watchList, setWatchlist] = useState([]);
  let [watchlistIds, setWatchlistIds] = useState(new Set());
  let [genre, setgenre] = useState(new Set());

  useEffect(() => {
    const storedList = localStorage.getItem("movieWatchList");
    const storedIds = localStorage.getItem("watchlistIds");
    if (storedList && storedIds) {
      try {
        const parsedList = JSON.parse(storedList);
        const parsedIds = new Set(JSON.parse(storedIds));
        setWatchlist(parsedList);
      } catch (err) {
        localStorage.clear();
        console.error("Error parsing watchlist from localStorage:", err);
        setWatchlist([]); // fallback to empty array
      }
    }
  }, []);

  useEffect(() => {
    let allgenre = new Set();
    (() => {
      let newList = watchList.map((item) => {
        let genrelist = [];
        item.relationships.genres.data.map((g) => {
          genrelist.push(genres[g.id]);
        });
        return { ...item, genre: genrelist };
      });
      newList.forEach((item) => {
        item.genre.forEach((g) => allgenre.add(g));
      });
      localStorage.setItem("movieWatchList", JSON.stringify(newList));
    })();
    setgenre(allgenre);
  }, [watchList]);

  let handleAddtoWatchlist = (movieObj, flag) => {
    setWatchlistIds((prev) => {
      let updated = new Set(prev);
      if (flag) updated.add(movieObj.id);
      else updated.delete(movieObj.id);
      localStorage.setItem("watchlistIds", JSON.stringify(Array.from(updated)));
      return updated;
    });
    setWatchlist((prev) => {
      const watchlistupdated = flag
        ? [...prev, movieObj]
        : prev.filter((obj) => obj.id !== movieObj.id);
      console.log(watchlistupdated);
      return watchlistupdated;
    });
  };

  return (
    <watchlistContext.Provider
      value={{ watchList, watchlistIds, handleAddtoWatchlist, genre }}
    >
      {children}
    </watchlistContext.Provider>
  );
};
