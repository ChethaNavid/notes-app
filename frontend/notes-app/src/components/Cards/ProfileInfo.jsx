import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({onLogout}) => {
  return (
    <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex justify-center items-center rounded-full text-slate-950 bg-slate-100'>
            {getInitials("Chetha Navid")}
        </div>
        <div className=''>
            <p className='text-sm font-medium'>Chetha Navid</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default ProfileInfo