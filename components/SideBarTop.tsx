"use client"

import { useUserStore } from '@/lib/store/userStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebarStore } from '@/lib/store/sidebarStore';
import { useState, useRef, useEffect } from 'react';
import { NotificationsModal } from '@/components/ui/NotificationsModal';
import { UserMenu } from '@/components/ui/UserMenu';
import { getUserImageUrl } from '@/lib/utils';

interface SideBarTopProps {
  onMenuClick?: () => void;
}

const SideBarTop = ({ onMenuClick }: SideBarTopProps) => {
  const { user } = useUserStore()
  const { isCollapsed, toggleSidebar } = useSidebarStore()
  const { unreadCount, fetchNotifications } = useNotificationStore()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  const roleName = typeof user?.role === 'object' && user?.role !== null
    ? (user.role as any).name
    : user?.role;

  let fallbackRole = '';
  if (user?.is_superuser) {
    fallbackRole = 'SuperAdmin';
  } else if (user?.is_staff) {
    fallbackRole = 'Administrador';
  }
  const displayRole = roleName || fallbackRole;

  return (
    <>
      <header className='w-full'>
        <div className='bg-white p-3 sm:p-[12px]'>
          <div className='flex items-center gap-2 sm:gap-4 justify-between'>
            {/* Logo and menu icon */}
            <div className='flex items-center gap-2 sm:gap-4'>
              <button type='button'
                onClick={onMenuClick}
                className='lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-all'
                aria-label='Abrir menú'
              >
                <Menu className='w-5 h-5' />
              </button>
              <button type='button'
                onClick={toggleSidebar}
                className='hidden lg:flex p-2 hover:bg-slate-100 rounded-lg transition-all items-center justify-center'
                aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
                title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className='w-5 h-5 text-gray-600' />
                ) : (
                  <PanelLeftClose className='w-5 h-5 text-gray-600' />
                )}
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
            <div className='flex items-center gap-2 sm:gap-[15px] flex-shrink-0'>

              <button type='button'
                onClick={() => setIsNotificationsOpen(true)}
                className='p-2 hover:bg-slate-100 rounded-lg transition-all lg:p-0 lg:hover:bg-transparent relative'
                aria-label='Notificaciones'
              >
                <Image src={'/notification.svg'} alt='notification' width={24} height={24} />
                {/* Badge de notificaciones no leídas */}
                {unreadCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-primary_color text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm'>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User info - Clickable */}
              <div className='relative' ref={userMenuRef}>
                <button type='button'
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='flex items-center space-x-2 hover:bg-slate-50 p-2 rounded-lg transition-all'
                >
                  <div className='bg-slate-100 w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative'>
                    {user?.profile_picture ? (
                      <Image
                        src={getUserImageUrl(user.profile_picture)}
                        alt={user?.name || "Usuario"}
                        fill
                        sizes="40px"
                        unoptimized={true}

                        className="object-cover"
                      />
                    ) : (
                      <User className='w-4 h-4 sm:w-5 sm:h-5 text-slate-500' />
                    )}
                  </div>
                  <div className='hidden md:block text-left'>
                    <p className='text-sm font-medium'>{user?.name || 'Usuario'}</p>
                    <p className='text-xs text-gray-500'>{displayRole}</p>
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