"use client"

import { useUserStore } from '@/lib/store/userStore';
import Image from 'next/image';
import Link from 'next/link';

const SideBarTop = () => {
  const { user } = useUserStore()

  return (
    <header className='w-full'>
      <div className='bg-white p-[12px]'>
        <div className=' flex'>
          {/* Logo and menu icon */}
          <Link href={'/'} className='flex items-center space-x-4'>
            <div className='hidden lg:flex items-center justify-center w-[150px]'>
              <Image src={'/logo.png'} alt='logo' width={100} height={100} className='object-contain' />
            </div>
            <Image src={'/Menu.svg'} alt='menu' width={18} height={14} className='lg:hidden' />
            <Image
              src={'search.svg'}
              alt='search'
              width={16}
              height={16}
              className='lg:hidden cursor-pointer'
            />
          </Link>

          {/* Search input - hidden on mobile unless activated */}
          <div className={`relative ml-[90px] flex-grow mx-4 lg:block`}>
            <div className=' absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Image
                src='/search.svg'
                alt='search'
                width={16}
                height={16}
                className='text-gray-400'
              />
            </div>
            <input
              type='text'
              placeholder='Buscar propiedad, cliente, etc.'
              className='w-[480px] pl-10 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500'
            />

            <button
              className='absolute inset-y-0 right-0 pr-3 flex items-center lg:hidden'

            >
              <span className='text-gray-400'>×</span>
            </button>

          </div>

          {/* Icons and user info */}
          <div className='flex items-center gap-[15px]'>

            <Image src={'/notification.svg'} alt='notification' width={24} height={24} />

            {/* User info - simplified for mobile */}
            <div className='flex items-center space-x-2'>
              <div className='bg-black w-[40px] h-[40px] rounded-full'></div>
              {/* <img
              src='/api/placeholder/32/32'
              alt='User avatar'
              className='w-8 h-8 rounded-full'
            /> */}
              <div className='hidden lg:block'>
                <p className='text-sm font-medium'>{user?.name}</p>
                <p className='text-xs text-gray-500'>Gerente de la empresa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SideBarTop