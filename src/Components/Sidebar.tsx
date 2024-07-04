import React, { useState } from 'react'
import LogoXs from "../assets/Logo_xs.png"
import LogoXl from "../assets/Logo_xl.png"
import MenuSide from './MenuSide'
import { Button } from 'antd'
import { PiSignOutThin } from 'react-icons/pi'
export default function Sidebar() {
    const [collapsed, setCollapsed] = useState<boolean>(true)
  return (
    <div className={`hidden md:flex flex-col justify-between h-full shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] bg-white  ${collapsed ? "md:w-56 lg:w-72" : "md:w-24"} transition-all`}>
        <div className='flex flex-col overflow-y-auto'>
            <div className='w-full flex justify-center items-center h-28'>
                {collapsed ? (
                    <img src={LogoXl} alt="" className='w-36'/>
                    
                ): (
                    <img src={LogoXs} alt="" className='w-12' />
                )}
            </div>
        </div>
        <ul className='my-4 flex flex-col items-start justify-between p-4 gap-y-8 overflow-x-auto '>
            <MenuSide/>
            <MenuSide/>
            <MenuSide/>
            <MenuSide/>
            <MenuSide/>
        </ul>
        <div className='w-full my-4 flex justify-center items-center'>
            <Button size={"large"} icon={<PiSignOutThin />} >{collapsed ? "Cerrar Sesión" : ""}</Button>
        </div>
    </div>
  )
}
