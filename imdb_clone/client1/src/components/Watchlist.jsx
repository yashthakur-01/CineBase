import React from "react";
import Search from "./Watchlist/Search";
import Table from "./Watchlist/Table";
import Genre from "./Watchlist/Genre";

function Watchlist() {
  function getGenres(anime) {
  if (!anime.relationships.genres.data) return [];
  
  return anime.relationships.genres.data.map(rel => {
    const genreObj = included.find(
      inc => inc.type === 'genres' && inc.id === rel.id
    );
    return genreObj ? genreObj.attributes.name : null;
  }).filter(Boolean);
}

  return (

    <>
      <Genre></Genre>
      <Search></Search>
      <Table ></Table>
    </>
  );
}

export default Watchlist;
