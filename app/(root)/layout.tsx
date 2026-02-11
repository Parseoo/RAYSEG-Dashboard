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
  const [isHydrated, setIsHydrated] = useState(false);
  const [isZustandReady, setIsZustandReady] = useState(false);
  const { isLogin, token, logout } = useUserStore()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Activar auto-logout por inactividad (30 minutos)
  useAutoLogout(30);

  // Esperar a que Zustand termine de rehidratar desde localStorage
  useEffect(() => {
    // Pequeño delay para asegurar que Zustand terminó de cargar
    const timer = setTimeout(() => {
      setIsZustandReady(true);
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Validar expiración del token al cargar
  useEffect(() => {
    if (!isZustandReady) return;

    const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;

    if (jwtToken && isTokenExpired(jwtToken)) {
      console.log('Token expirado, cerrando sesión...');
      logout();
      clearAuthHeader();
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refresh_token');
      router.push('/sign-in');
    }
  }, [isZustandReady, logout, router]);

  // Configurar header de autorización si hay token
  useEffect(() => {
    if (token) {
      setAuthHeader(token);
    }
  }, [token]);

  // Redirigir a /sign-in si no está logueado (solo después de que Zustand esté listo)
  useEffect(() => {
    if (isZustandReady && !isLogin) {
      router.push('/sign-in');
    }
  }, [isZustandReady, isLogin, router]);

  // Mientras se hidrata o si no está logueado, permitir que los hooks manejen la redirección
  // Sin bloquear la UI con un loader de pantalla completa

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

