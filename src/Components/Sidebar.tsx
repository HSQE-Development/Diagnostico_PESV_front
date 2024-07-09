import React, { useState } from 'react'
import LogoXs from "../assets/Logo_xs.png"
import LogoXl from "../assets/Logo_xl.png"
import MenuSide from './MenuSide'
import { Button } from 'antd'
import { PiSignOutThin } from 'react-icons/pi'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { IoBarChartOutline, IoBusiness } from 'react-icons/io5'
import { MdOutlineBusinessCenter } from 'react-icons/md'
import { BsDiagram3Fill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
export default function Sidebar() {
    const sideBarState = useAppSelector(state => state.sidebarState)
  const navigate = useNavigate();

  return (
    <div className={`hidden md:flex flex-col justify-between h-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] bg-white  ${sideBarState.isCollapsed ? "md:w-56 lg:w-72" : "md:w-20"} transition-all`}>
        <div className='flex flex-col overflow-y-auto'>
            <div className='w-full flex justify-center items-center h-28'>
                {sideBarState.isCollapsed ? (
                    <img src={LogoXl} alt="" className='w-36'/>
                    
                ): (
                    <img src={LogoXs} alt="" className='w-12' />
                )}
            </div>
        </div>
        <ul className={`my-4 flex flex-col ${sideBarState.isCollapsed ? "items-start": "items-center"} justify-between p-4 gap-y-8 overflow-x-auto `}>
            <MenuSide icon={<IoBarChartOutline />} label='Dashboard' onPress={() => navigate("/app")} url='/app'/>
            <MenuSide icon={<IoBusiness />} label='Empresas' onPress={() => navigate("/app/companies")} url='/app/companies'/>
            <MenuSide icon={<MdOutlineBusinessCenter />} label='Consultores' onPress={() => navigate("/app")} url='/app/consultores'/>
            <MenuSide icon={<BsDiagram3Fill />} label='Diagnosticos' onPress={() => navigate("/app")} url='/app/diagnosis'/>
        </ul>
        <div className='w-full my-4 flex justify-center items-center'>
            <Button size={"large"} icon={<PiSignOutThin />} >{sideBarState.isCollapsed ? "Cerrar Sesión" : ""}</Button>
        </div>
    </div>
  )
}
