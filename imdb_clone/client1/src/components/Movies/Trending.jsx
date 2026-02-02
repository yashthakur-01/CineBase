import React, { useEffect, useState,useContext } from "react";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";
import axios from "axios";
import { watchlistContext } from "../../WatchlistProvider";

function Trending() {
  let [data, setData] = useState([]);
  let [page, SetPage] = useState(1);
  let [loading, setLoading] = useState(false);

  const {watchlistIds,handleAddtoWatchlist} = useContext(watchlistContext);

  let handletoggle = (id, movieObj) => {
      handleAddtoWatchlist(movieObj, !watchlistIds.has(id));
  };
  function onclick(e) {
    if (e.target.id === "back" && page > 1) {
      SetPage(page - 1);
    } else if (e.target.id === "front") {
      SetPage(page + 1);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log("hello1");
        let result1 = await axios.get(
          `https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=${
            (page - 1) * 24 + 1
          }&include=genres`
        );
        let result2 = await axios.get(
          `https://kitsu.io/api/edge/anime?page[limit]=4&page[offset]=${
            (page - 1) * 24 + 21
          }&include=genres`
        );

        setData([...result1.data.data, ...result2.data.data]);
        console.log(data[0]);
      } catch (error) {
        console.error("Error occured in fetching anime: ", error);
      }finally{
        setLoading(false);
      }
    })();
  }, [page]);

  if (loading)
    return (
      <div>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <Pagination page={page} onclick={onclick} />
      </div>
    );
  return (
    <div>
      <div className="bg-blue-200 p-3 text-center text-4xl font-bold my-8 mb-[3rem]">
        Trending Movies
      </div>
      <div className=" my-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 grid-flow-row auto-cols-max place-items-center gap-y-7">
        {data.map((item, index) => {
          return (
            <MovieCard
              key={index}
              id={item.id}
              title={item.attributes.titles["en_jp"]}
              image={item.attributes.posterImage["original"]}
              ontoggle={() => handletoggle(item.id, item)} //using arrow function as we need variables as well - id and movieObj else we will need to pass the variable seperately
              ismovieadded={watchlistIds.has(item.id)}
            ></MovieCard>
          );
        })}
      </div>

      <Pagination page={page} onclick={onclick} />
    </div>
  );
}

export default Trending;
