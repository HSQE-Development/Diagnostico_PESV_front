import { Avatar, Badge, Button, Dropdown, MenuProps } from 'antd'
import React from 'react'
import { CiUser } from 'react-icons/ci'

interface MiniProfileProps{
    username: string
    cargo:string
}

export default function MiniProfile({username, cargo}:MiniProfileProps) {
    const items: MenuProps['items'] = [
        {
          label: 'Perfil',
          key: '1',
        },
        {
          label: 'Cerrar Sesión',
          key: '2',
        },
      ];
  return (
    <div className='flex justify-evenly items-center gap-x-2'>
        <div className='flex flex-col items-end'>
            <span className='font-bold text-sm'>{username}</span>
            <Badge text={cargo} showZero color="#faad14" />
        </div>
        {/* <Avatar src={<img src={url} alt="avatar" />} /> */}
        <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}>
            <Avatar style={{ backgroundColor: '#000' }} icon={<CiUser/>} />
            {/* <Button>bottom</Button> */}
        </Dropdown>
    </div>
  )
}
