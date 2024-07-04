import { Avatar, Button } from 'antd'
import React from 'react'
import { CiMenuFries, CiUser } from 'react-icons/ci'
import MiniProfile from './MiniProfile'

export default function Navbar() {
  return (
    <div className='sticky w-[90%] rounded-md my-4 p-4 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] transition-all'>
        <div className='flex justify-between items-center '>
            <CiMenuFries className='font-extrabold text-2xl cursor-pointer'/>
            <div className='hidden md:flex md:gap-x-4 md:justify-evenly flex-1'>
                <Button size='large' type="dashed">Dashed</Button>
                <Button size='large'  type="dashed">Dashed</Button>
                <Button size='large'  type="dashed">Dashed</Button>
                <Button size='large'  type="dashed">Dashed</Button>
            </div>
            <MiniProfile username='Daniel Rodriguez' cargo='SuperUser'/>
        </div>
    </div>
  )
}
