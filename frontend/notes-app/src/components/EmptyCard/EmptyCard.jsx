import React from 'react'

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className='flex justify-center items-center flex-col mt-20'>
        <img src={imgSrc} alt="No notes" className='w-60'></img>

        <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
            {message}
        </p>
    </div>
  )
}

export default EmptyCard