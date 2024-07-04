import { FloatButton, Image, Modal } from 'antd'
import React, { useState } from 'react'
import { MdModeEdit } from 'react-icons/md'
import InfoProfile from './Components/InfoProfile'

export default function ProfilePage() {
  return (
    <>
      <div className='grid gap-4 grid-cols-6 h-full md:grid-rows-2 p-4'>
      <div className='relative row-span-2 col-span-6 md:col-span-2 bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl'>
       <InfoProfile/>
      </div>
      <div className='row-span-1 col-span-6 md:col-span-4  bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl'>
        In progress
      </div>
      <div className='col-span-6 md:col-span-2 bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl'></div>
      <div className='col-span-6 md:col-span-2 bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl'></div>

    </div>
      
    </>
  )
}
