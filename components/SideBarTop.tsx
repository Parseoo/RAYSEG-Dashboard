"use client"

import { useUserStore } from '@/lib/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState, useRef } from 'react';
import { NotificationsModal } from '@/components/ui/NotificationsModal';
import { UserMenu } from '@/components/ui/UserMenu';

interface SideBarTopProps {
  onMenuClick?: () => void;
}

const SideBarTop = ({ onMenuClick }: SideBarTopProps) => {
  const { user } = useUserStore()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  return (
    <>
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
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent relative'
                aria-label='Notificaciones'
              >
                <Image src={'/notification.svg'} alt='notification' width={24} height={24} />
                {/* Badge de notificaciones no leídas */}
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>

              {/* User info - Clickable */}
              <div className='relative' ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-colors'
                >
                  <div className='bg-black w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full flex-shrink-0'></div>
                  <div className='hidden md:block text-left'>
                    <p className='text-sm font-medium'>{user?.name || 'Usuario'}</p>
                    <p className='text-xs text-gray-500'>Gerente de la empresa</p>
                  </div>
                </button>

                {/* User dropdown menu */}
                <UserMenu
                  isOpen={isUserMenuOpen}
                  onClose={() => setIsUserMenuOpen(false)}
                  anchorRef={userMenuRef}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar de Notificaciones */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  )
}

export default SideBarTop