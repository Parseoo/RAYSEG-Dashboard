"use client"
import { SideBar, MobileSidebar } from '@/components/SideBar';
import SideBarTop from '@/components/SideBarTop';
import { useUserStore } from '@/lib/store/userStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


const Layout = ({children} : {children: React.ReactNode}) => {
  const {isLogin, token} = useUserStore()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirigir a /sing-in si no está logueado
  useEffect(() => {
    if (!isLogin && !token) {
      router.push('/sing-in');
    }
  }, [isLogin, token, router]);

  // Si no está logueado, mostrar un loader mientras redirige
  if (!isLogin && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen'>
      <SideBarTop onMenuClick={() => setIsMobileMenuOpen(true)} />
      <div className='flex flex-1 overflow-hidden'>
        <SideBar />
        <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className='flex-1 overflow-auto p-4 sm:p-6 bg-gray-200 rounded-ss-[12px]'>
          {children}
        </main>
      </div>
    </div>
  )
          
}

export default Layout

