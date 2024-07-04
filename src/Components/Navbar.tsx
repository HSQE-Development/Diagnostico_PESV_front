import { Avatar, Button } from 'antd'
import React from 'react'
import { CiMenuFries, CiUser } from 'react-icons/ci'
import MiniProfile from './MiniProfile'

export default function Navbar() {
  return (
    <div className='sticky top-0 w-[95%] z-20 rounded-md my-4 p-4 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] bg-white transition-all'>
        <div className='flex justify-between items-center '>
            <CiMenuFries className='font-extrabold text-2xl cursor-pointer'/>
            <h2 className='hidden md:flex text-xl font-bold ml-12'>Diagnostico PESV</h2>
            <MiniProfile username='Daniel Rodriguez' cargo='SuperUser'/>
        </div>
    </div>
  )
}
