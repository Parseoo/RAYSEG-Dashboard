"use client";

import React, { useEffect, useRef } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { useLogout } from '@/lib/api/auth/auth-query';

interface UserMenuProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef?: React.RefObject<HTMLElement>;
}

export function UserMenu({ isOpen, onClose, anchorRef }: UserMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useUserStore();
    const { mutate: logout } = useLogout();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                anchorRef?.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    const handleLogout = () => {
        logout();
        onClose();
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        onClose();
    };

    return (
        <div ref={menuRef} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Header del dropdown con info del usuario */}
            <div className="p-4 bg-slate-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="bg-black w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                            {user?.name || 'Admin Principal'}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                            {user?.email || 'admin@inmogestion.mx'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
                <button onClick={() => handleNavigation('/settings/my-profile')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all text-left">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Mi perfil</span>
                </button>

                <button onClick={() => handleNavigation('/settings/users-permissions')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all text-left">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Configuración</span>
                </button>

                <div className="border-t border-gray-200 mt-2 pt-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all text-left">
                        <LogOut className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserMenu;