import React, { useContext } from 'react'
import { watchlistContext } from '../../WatchlistProvider'

function Genre() {
  const {genre} = useContext(watchlistContext)
  let genres = [...genre]
  return (
    <>
    <div className='flex justify-center items-center w-full mx-auto flex-wrap'>
      {genres.map((item,ind)=>{
          return(<div key={ind} className='mx-5 my-3 text-white font-semibold bg-blue-400 py-3 px-6 rounded-[3.5px] hover:bg-blue-500'>{item}</div>)
      })}
        
    </div>
    </>  )
}

export default Genre