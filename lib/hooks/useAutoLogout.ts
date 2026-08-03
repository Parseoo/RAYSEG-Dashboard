'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { clearAuthHeader } from '@/lib/api/auth/auth-api';

/**
 * Hook para cerrar sesión automáticamente después de un período de inactividad
 * @param timeoutMinutes - Minutos de inactividad antes de cerrar sesión (default: 30)
 */
export const useAutoLogout = (timeoutMinutes: number = 30) => {
    const { logout, isLogin } = useUserStore();
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback(() => {
        // Limpiar todo
        logout();
        clearAuthHeader();

        if (typeof window !== 'undefined') {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refresh_token');
        }

        router.push('/sign-in');
    }, [logout, router]);

    const resetTimer = useCallback(() => {
        // Limpiar el timer anterior si existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Crear un nuevo timer
        timeoutRef.current = setTimeout(() => {
            console.log('Sesión cerrada por inactividad');
            handleLogout();
        }, timeoutMinutes * 60 * 1000); // Convertir minutos a milisegundos
    }, [handleLogout, timeoutMinutes]);

    useEffect(() => {
        // Solo activar si el usuario está logueado
        if (!isLogin) return;

        // Eventos que indican actividad del usuario
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

        // Registrar listeners para cada evento
        events.forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        // Iniciar el timer por primera vez
        resetTimer();

        // Cleanup: remover listeners y limpiar timer al desmontar
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isLogin, timeoutMinutes, resetTimer]); // Re-ejecutar si cambia el estado de login o el timeout
};
