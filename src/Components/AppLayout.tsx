import { Button, Layout, Menu, MenuProps } from 'antd'
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import { IoMdMenu } from 'react-icons/io';
import { RiSecurePaymentLine } from 'react-icons/ri';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface AppLayoutProps{
    children: React.ReactNode
}

export default function AppLayout({children}:AppLayoutProps) {
      const [collapsed, setCollapsed] = useState(false);
  return (
    <>
        <div className='w-screen h-screen flex flex-1'>
            <Sidebar/>
            <main className='flex-1 flex flex-col items-center'>
                <Navbar/>
                {children}

            </main>
        </div>
    
    </>
  )
}
