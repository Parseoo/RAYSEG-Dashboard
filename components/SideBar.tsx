"use client"

import { agents, home, property_list, clients } from '@/lib/link';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
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
  ScrollText,
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


const menuItems: MenuItem[] = [
  { href: home, path: '/', icon: ChartColumn, label: 'Reportes' },
  { href: property_list, path: '/property', icon: Building2, label: 'Propiedades' },
  { href: clients, path: '/clients', icon: Users, label: 'Clientes' },
  { href: agents, path: '/agents', icon: CircleUserRound, label: 'Agentes' },

  {
    icon: LayoutTemplate,
    label: 'Contenido Web',
    path: '/content-web',
    children: [
      { href: '/content-web/home', path: '/content-web/home', icon: Home, label: 'Home' },
      { href: '/content-web/services', path: '/content-web/servicios', icon: Briefcase, label: 'Servicios' },
      { href: '/content-web/locations', path: '/content-web/localizacion', icon: MapPinned, label: 'Localización' },
      { href: '/content-web/about-us', path: '/content-web/about-us', icon: Users, label: 'Sobre Nosotros' },
      { href: '/content-web/footer', path: '/content-web/footer', icon: PanelBottom, label: 'Footer' },
      { href: '/content-web/aviso', path: '/content-web/aviso', icon: FileKey, label: 'Aviso de Privacidad' },
      { href: '/content-web/terminos', path: '/content-web/terminos', icon: ScrollText, label: 'Terminos y Condiciones' },

    ]
  },
  {
    icon: Settings,
    label: 'Configuración',
    path: '/settings',
    children: [
      { href: '/settings/myprofile', path: '/settings/myprofile', icon: Home, label: 'Mi Perfil' },
      { href: '/settings/users', path: '/settings/users', icon: Home, label: 'Usuarios y Permisos' },
    ]
  },
]


export const SideBar = () => {
  const path = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  React.useEffect(() => {
    menuItems.forEach(item => {
      if ('children' in item && item.children) {
        // Check if any child matches the current path
        const isChildActive = item.children.some(child => child.path === path);

        if (isChildActive) {
          setOpenMenus(prev => {
            // Only update if not already open to avoid unnecessary re-renders
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
    const item = menuItems.find(m => 'path' in m && m.path === itemPath) as MenuItemGroup | undefined;
    if (item && 'children' in item && item.children) {
      return item.children.some(child => path === child.path);
    }
    return false;
  };

  return (
    <nav className='hidden bg-white lg:block w-[250px] h-screen pr-4 pl-4 text-second_text_color'>
      <ul className='mr-auto ml-auto max-w-[220px]'>
        {menuItems.map((item) => {
          const hasChildren = 'children' in item && item.children && item.children.length > 0;
          const itemPath = 'path' in item ? item.path : undefined;
          const isItemActive = isActive(itemPath);
          const isOpen = openMenus[item.label] || false;

          const Icon = item.icon;

          return (
            <li key={item.label} className='mb-1'>
              <div className='flex flex-col'>
                <div
                  className={cn(
                    'group flex items-center px-5 py-2 gap-1 rounded-lg transition-all cursor-pointer',
                    isItemActive ? 'bg-property_purple text-white' : 'hover:bg-gray-100'
                  )}
                  onClick={() => hasChildren && toggleMenu(item.label)}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 text-gray-700 group-hover:brightness-0 group-hover:invert transition-all duration-300',
                      isItemActive && 'brightness-0 invert'
                    )}
                  />
                  {hasChildren ? (
                    <span className='flex-1'>{item.label}</span>
                  ) : (
                    <Link href={item.href!} className='flex-1'>
                      {item.label}
                    </Link>
                  )}
                  {hasChildren && (
                    <span className='ml-auto'>
                      {isOpen ? (
                        <ChevronDown className='w-4 h-4' />
                      ) : (
                        <ChevronRight className='w-4 h-4' />
                      )}
                    </span>
                  )}
                </div>
                {hasChildren && isOpen && (
                  <ul className='ml-4 mt-1 space-y-1'>
                    {item.children?.map((child) => {
                      const isChildActive = path === child.path;
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
                          >
                            <ChildIcon
                              className={cn(
                                'w-5 h-5',
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
      </ul>
    </nav>
  )
}