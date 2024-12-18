import React from 'react'
import Image from 'next/image'
function Comment({user, comment, profileImage}) {
  return (
    <div className='flex items-center space-x-3 mb-4'>
        <Image src={profileImage} alt={username} width={50} height={50} className='rounded-full w-8 h-8 object-cover'/>
        <span>{username}</span>
        <span>{comment}</span>

        <div>
          <div className='flex flex-col'>
            <h4 className='font-semibold'>{user}</h4>
            <p className='text-gray-700 text-sm'>{comment}</p>
          </div>
        </div>
    </div>
  )
}

export default Comment