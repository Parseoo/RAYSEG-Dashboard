"use client"
import { SideBar, MobileSidebar } from '@/components/SideBar';
import SideBarTop from '@/components/SideBarTop';
import { useUserStore } from '@/lib/store/userStore';
import { setAuthHeader, clearAuthHeader } from '@/lib/api/auth/auth-api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { isTokenExpired } from '@/lib/utils/checkTokenExpiration';


const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLogin, token, logout, _hasHydrated } = useUserStore()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Activar auto-logout por inactividad (30 minutos)
  useAutoLogout(30);

  // Validar expiración del token al cargar (solo después de que el store esté listo)
  useEffect(() => {
    if (!_hasHydrated) return;

    if (token && isTokenExpired(token)) {
      console.log('Token expirado, cerrando sesión...');
      logout();
      clearAuthHeader();
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refresh_token');
      router.push('/sign-in');
    }
  }, [_hasHydrated, token, logout, router]);

  // Redirigir a /sign-in si no está logueado (solo después de que Zustand esté listo)
  useEffect(() => {
    if (_hasHydrated && !isLogin) {
      router.push('/sign-in');
    }
  }, [_hasHydrated, isLogin, router]);

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


