"use client"
import { SideBar, MobileSidebar } from '@/components/SideBar';
import SideBarTop from '@/components/SideBarTop';
import { useUserStore } from '@/lib/store/userStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAutoLogout } from '@/lib/hooks/useAutoLogout';
import { isTokenExpired } from '@/lib/utils/checkTokenExpiration';


const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLogin, token, logout, _hasHydrated, isSessionExpired } = useUserStore()
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
      // Ya no mostramos el mensaje de expirado al abrir la app después de mucho tiempo
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refresh_token');
    }
  }, [_hasHydrated, token, logout]);

  // Redirigir a /sign-in si no está logueado (solo después de que Zustand esté listo)
  useEffect(() => {
    if (_hasHydrated && !isLogin) {
      if (isSessionExpired) {
        router.push('/sign-in?session_expired=true');
      } else {
        router.push('/sign-in');
      }
    }
  }, [_hasHydrated, isLogin, isSessionExpired, router]);

  const isExpired = token ? isTokenExpired(token) : false;
  const isAuthenticated = isLogin && !isExpired;

  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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


