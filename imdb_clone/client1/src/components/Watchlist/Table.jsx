import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { watchlistContext } from "../../WatchlistProvider";


function Table() {

  const {watchList,handleAddtoWatchlist} = useContext(watchlistContext);
  return (
    <>
      <div className="border-gray-700 m-8">
        <table className="w-full text-black text center">
          <thead className="border-b-2 border-gray-400  bg-gray-100">
            <tr>
              <th className="w-1/2 py-5 px-2">Name</th>
              <th className="w-1/6 py-5 px-2">Rating</th>
              <th className="w-1/6 py-5 px-2">Popularity Rank</th>
              <th className="w-1/6 py-5 px-2">Genre</th>
              <th className="w-1/12 py-5 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {watchList.map((item, ind) => {
              return (
                <tr className="bg-gray-100 border-b border-gray-400" key={ind}>
                  <td className="m-4 p-4 flex justify-start border-gray-300 ">
                    <img
                      className="h-[10rem] w-[8rem]"
                      src={item.attributes.posterImage["original"]}
                    ></img>
                    <div className="mx-9 my-5 text-2xl ">
                      {item.attributes.titles["en_jp"]}
                    </div>
                  </td>
                  <td className="column-style">
                    {(item.attributes.averageRating / 10).toFixed(2)}
                  </td>
                  <td className="column-style">
                    {item.attributes.popularityRank}
                  </td>
                  <td className="column-style">{item.genre.join(", ")}</td>
                  <td className="text-white pr-7 ">
                    <div className=" h-full mb-[5rem]">
                      <button className="bg-red-500 top-0 px-3 py-2 mt-0 rounded-[8px]" onClick={()=>handleAddtoWatchlist(item,false)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
