"use client"

import { agents, home, property_list, clients } from '@/lib/link';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { useUserStore } from '@/lib/store/userStore';
import WarningModal from './ui/WarningModal';
import {
  ChartColumn,
  Building2,
  CircleUserRound,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  LayoutTemplate,
  MapPinned,
  PanelBottom,
  FileKey,
  X,
  FileText,
} from 'lucide-react';

type MenuItemBase = {
  icon: React.ComponentType<{ className?: string }>
  label: string
}

type MenuItemLink = MenuItemBase & {
  href: string
  path: string
  children?: never
}

type MenuItemGroup = MenuItemBase & {
  children: MenuItem[]
  href?: never
  path?: string // solo para estado activo / toggle
}

type MenuItem = MenuItemLink | MenuItemGroup


export const menuItems: MenuItem[] = [
  { href: home, path: '/', icon: ChartColumn, label: 'Reportes' },
  { href: property_list, path: '/property', icon: Building2, label: 'Propiedades' },
  { href: clients, path: '/clients', icon: Users, label: 'Clientes' },
  { href: agents, path: '/agents', icon: CircleUserRound, label: 'Agentes' },
  //{ href: '/contracts', path: '/contracts', icon: FileText, label: 'Contratos' },

  {
    icon: LayoutTemplate,
    label: 'Contenido Web',
    path: '/content-web',
    children: [
      { href: '/content-web/home', path: '/content-web/home', icon: Home, label: 'Home' },
      { href: '/content-web/services', path: '/content-web/services', icon: Briefcase, label: 'Servicios' },
      { href: '/content-web/locations', path: '/content-web/locations', icon: MapPinned, label: 'Localización' },
      { href: '/content-web/about-us', path: '/content-web/about-us', icon: Users, label: 'Sobre Nosotros' },
      { href: '/content-web/footer', path: '/content-web/footer', icon: PanelBottom, label: 'Footer' },
      { href: '/content-web/legal-pages', path: '/content-web/legal-pages', icon: FileKey, label: 'Paginas Legales' },
    ]
  },
  {
    icon: Settings,
    label: 'Configuración',
    path: '/settings',
    children: [
      { href: '/settings/my-profile', path: '/settings/my-profile', icon: Home, label: 'Mi Perfil' },
      { href: '/settings/users-permissions', path: '/settings/users-permissions', icon: Home, label: 'Usuarios y Permisos' },
    ]
  },
]

// Componente para renderizar el menú (reutilizable)
const MenuContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const path = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { user } = useUserStore();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const isAdmin = user?.is_staff || user?.is_superuser;

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  useEffect(() => {
    menuItems.forEach(item => {
      if ('children' in item && item.children) {
        const isChildActive = item.children.some(child => child.path === path);

        if (isChildActive) {
          setOpenMenus(prev => {
            if (prev[item.label]) return prev;
            return { ...prev, [item.label]: true };
          });
        }
      }
    });
  }, [path]);

  const isActive = (itemPath?: string) => {
    if (!itemPath) return false;
    if (path === itemPath) return true;
    // Verificar si la ruta actual empieza con el path del item (para subrutas)
    if (path.startsWith(itemPath) && itemPath !== '/') return true;
    const item = menuItems.find(m => 'path' in m && m.path === itemPath) as MenuItemGroup | undefined;
    if (item && 'children' in item && item.children) {
      return item.children.some(child => path === child.path || path.startsWith(child.path + '/'));
    }
    return false;
  };

  return (
    <ul className='mr-auto ml-auto max-w-[220px] w-full pb-8'>
      {menuItems.map((item) => {
        const hasChildren = 'children' in item && item.children && item.children.length > 0;
        const itemPath = 'path' in item ? item.path : undefined;
        const isItemActive = isActive(itemPath);
        const isOpen = openMenus[item.label] || false;

        const Icon = item.icon;

        return (
          <li key={item.label} className='mb-1'>
            <div className='flex flex-col'>
              {hasChildren ? (
                <div
                  className={cn(
                    'group flex items-center px-5 py-2 gap-1 rounded-lg transition-all cursor-pointer',
                    isItemActive ? 'bg-property_purple text-white' : 'hover:bg-gray-100'
                  )}
                  onClick={() => toggleMenu(item.label)}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 text-gray-700 transition-all duration-300',
                      isItemActive && 'brightness-0 invert'
                    )}
                  />
                  <span className='flex-1'>{item.label}</span>
                  <span className='ml-auto'>
                    {isOpen ? (
                      <ChevronDown className='w-4 h-4' />
                    ) : (
                      <ChevronRight className='w-4 h-4' />
                    )}
                  </span>
                </div>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onLinkClick}
                  className={cn(
                    'group flex items-center px-5 py-2 gap-1 rounded-lg transition-all cursor-pointer',
                    isItemActive ? 'bg-property_purple text-white' : 'hover:bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 text-gray-700 transition-all duration-300',
                      isItemActive && 'brightness-0 invert'
                    )}
                  />
                  <span className='flex-1'>{item.label}</span>
                </Link>
              )}
              {hasChildren && isOpen && (
                <ul className='ml-4 mt-1 space-y-1'>
                  {item.children?.map((child) => {
                    const isChildActive = path === child.path || path.startsWith(child.path + '/');
                    const ChildIcon = child.icon;
                    return (
                      <li key={child.href ?? child.label}>
                        <Link
                          href={child.href!}
                          className={cn(
                            'flex items-center px-5 py-2 gap-2 rounded-lg transition-all',
                            isChildActive
                              ? 'bg-property_purple text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          )}
                          onClick={(e) => {
                            if (child.label === 'Usuarios y Permisos' && !isAdmin) {
                              e.preventDefault();
                              setWarningMessage("Solo los administradores pueden acceder a esta sección.");
                              setShowWarning(true);
                              return;
                            }
                            if (onLinkClick) onLinkClick();
                          }}
                        >
                          <ChildIcon
                            className={cn(
                              'w-5 h-5 text-gray-700 transition-all duration-300',
                              isChildActive && 'brightness-0 invert'
                            )}
                          />
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        );
      })}
      <WarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Acceso Restringido"
        message={warningMessage}
      />
    </ul>
  );
};

export const SideBar = () => {
  return (
    <nav className='hidden bg-white lg:flex flex-col w-[250px] h-screen pr-4 pl-4 text-second_text_color'>
      <div className='flex-1 overflow-y-auto pt-4 pb-6'>
        <MenuContent />
      </div>
    </nav>
  )
}

// Componente para el menú móvil
export const MobileSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
        onClick={onClose}
      />
      {/* Sidebar */}
      <nav className='fixed left-0 top-0 h-screen w-[280px] bg-white z-50 shadow-xl lg:hidden flex flex-col'>
        <div className='flex items-center justify-between p-4 border-b flex-shrink-0'>
          <h2 className='text-lg font-semibold'>Menú</h2>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <div className='flex-1 overflow-y-auto pt-4 pb-6 px-4 text-second_text_color'>
          <MenuContent onLinkClick={onClose} />
        </div>
      </nav>
    </>
  );
};