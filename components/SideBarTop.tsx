"use client"

import { useUserStore } from '@/lib/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

interface SideBarTopProps {
  onMenuClick?: () => void;
}

const SideBarTop = ({ onMenuClick }: SideBarTopProps) => {
  const { user } = useUserStore()

  return (
    <header className='w-full'>
      <div className='bg-white p-3 sm:p-[12px]'>
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Logo and menu icon */}
          <div className='flex items-center gap-2 sm:gap-4'>
            <button
              onClick={onMenuClick}
              className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Abrir menú'
            >
              <Menu className='w-5 h-5' />
            </button>
            <Link href={'/'} className='flex items-center'>
              <div className='hidden lg:flex items-center justify-center w-[150px]'>
                <Image src={'/logo.png'} alt='logo' width={100} height={100} className='object-contain' />
              </div>
              <div className='lg:hidden'>
                <Image src={'/logo.png'} alt='logo' width={80} height={80} className='object-contain' />
              </div>
            </Link>
          </div>

          {/* Search input */}
          <div className='relative flex-1 max-w-full lg:max-w-none'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
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
              className='w-full max-w-[480px] pl-10 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500 text-sm sm:text-base'
            />
          </div>

          {/* Icons and user info */}
          <div className='flex items-center gap-2 sm:gap-[15px] flex-shrink-0'>
            <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent'>
              <Image src={'/notification.svg'} alt='notification' width={24} height={24} />
            </button>

            {/* User info */}
            <div className='flex items-center space-x-2'>
              <div className='bg-black w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full flex-shrink-0'></div>
              <div className='hidden md:block'>
                <p className='text-sm font-medium'>{user?.name || 'Usuario'}</p>
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