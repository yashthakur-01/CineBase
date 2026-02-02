import React from "react";

function Search() {
  return (
    <>
      <div className="flex items-center justify-center my-8">
        <input placeholder='Enter Movie Name' className ="rounded-[8px] px-2 py-3 w-[23rem] bg-gray-200 hover:bg-gray-300" type="text" />
      </div>
    </>
  );
}

export default Search;
