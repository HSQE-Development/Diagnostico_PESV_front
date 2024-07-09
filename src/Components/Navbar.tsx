import React from 'react'
import { CiMenuBurger, CiMenuFries } from 'react-icons/ci'
import MiniProfile from './MiniProfile'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { setCollapsed } from '@/stores/features/sideBarSlice'

export default function Navbar() {
  const authUser = useAppSelector(state => state.auth.authUser)
  const dispatch = useAppDispatch()
  const isCollapsed = useAppSelector(state => state.sidebarState.isCollapsed)

  return (
    <div className='sticky top-0 w-[95%] z-20 rounded-md my-4 p-4 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] bg-white transition-all'>
        <div className='flex justify-between items-center '>
            {isCollapsed ? (
              <CiMenuBurger className='font-extrabold text-2xl cursor-pointer' onClick={() => dispatch(setCollapsed())}/>
            ): (

              <CiMenuFries className='font-extrabold text-2xl cursor-pointer' onClick={() => dispatch(setCollapsed())}/>
            )}
            <h2 className='hidden md:flex text-xl font-bold ml-12'>Diagnostico PESV</h2>
            <MiniProfile username={`${authUser?.user.first_name ? authUser?.user.first_name : ""} ${authUser?.user.first_name ? authUser?.user.last_name : ""}`} cargo='SuperUser'/>
        </div>
    </div>
  )
}
