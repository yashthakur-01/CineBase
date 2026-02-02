import React from "react";

function Pagination({page,onclick}) {
  return (
    <div className="text-center flex justify-center items-center bg-blue-200 p-3 my-8 h-[50px] w-full">
      <div onClick={onclick}  className="px-9 transform hover:scale-[130%]">
        <div id='back' className="fa-solid fa-arrow-left"></div>
      </div>
      <div className="p3 mx-4 text-xl font-bold">{page}</div>
      <div onClick={onclick}  className="px-9 transform hover:scale-[130%]">
        <div id='front' className="fa-solid fa-arrow-right"></div>
      </div>
    </div>
  );
}

export default Pagination;
