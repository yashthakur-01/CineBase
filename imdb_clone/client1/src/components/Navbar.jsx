import React from "react";
import logo from "../assets/logo.webp";
import {Link}from 'react-router-dom'

function Navbar() {
  return (
    <>
      <div className="bg-blue-200 flex mx-0 my-4 justify-between space-x-8 items-center px-3 py-3">
        <div className="flex items-center text-center ">
          <img className="w-[50px] mr-0" src={logo} alt=""></img>
          <div id='logo' className="text-blue-900 text-5xl font-bold text-start mx-3">KawaiiDB</div>
        </div>
        <div className="flex justify-between items-center p-3 gap-8">
          <Link className="text-blue-500 text-2xl font-bold"  to="/">Movies</Link>
          <Link className="text-blue-500 text-2xl font-bold" to="/watchlist">WatchList</Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
