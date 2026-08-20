"use client"

import { home, property_list, clients } from '@/lib/link';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react'
import { useUserStore } from '@/lib/store/userStore';
import { useSidebarStore } from '@/lib/store/sidebarStore';
import WarningModal from './ui/WarningModal';
import {
  ChartColumn,
  Building2,
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
  UserCog,
  Shield,
  Library,
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
      { href: '/settings/users-permissions', path: '/settings/users-permissions', icon: UserCog, label: 'Usuarios' },
      { href: '/settings/roles', path: '/settings/roles', icon: Shield, label: 'Roles' },
      //{ href: '/settings/permissions', path: '/settings/permissions', icon: Key, label: 'Permisos' },
      { href: '/catalogs', path: '/catalogs', icon: Library, label: 'Catálogos' },
    ]
  },
]

// Tooltip component for collapsed sidebar
const Tooltip = ({ children, label, show }: { children: React.ReactNode; label: string; show: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipPosition(rect.top + rect.height / 2);
    }
  }, [isHovered]);

  if (!show) return <>{children}</>;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div
          className="fixed z-[9999] ml-2 pointer-events-none"
          style={{ top: tooltipPosition, left: '68px', transform: 'translateY(-50%)' }}
        >
          <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
            {label}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
};

// Dropdown submenu for collapsed sidebar groups (expands downward)
const CollapsedSubmenu = ({
  item,
  isActive,
  path,
  onLinkClick,
}: {
  item: MenuItemGroup;
  isActive: (p?: string) => boolean;
  path: string;
  onLinkClick?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserStore();
  const isAdmin = user?.is_staff || user?.is_superuser;
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const Icon = item.icon;
  const isItemActive = isActive(item.path);

  return (
    <>
      <div className="flex flex-col items-center">
        <Tooltip label={item.label} show={!isOpen}>
          <button type='button'
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-lg transition-all cursor-pointer',
              isItemActive ? 'bg-property_purple text-white' : 'hover:bg-gray-100'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon
              className={cn(
                'w-5 h-5 text-gray-700 transition-all duration-300',
                isItemActive && 'brightness-0 invert'
              )}
            />
          </button>
        </Tooltip>

        {/* Dropdown submenu (below the icon) */}
        {isOpen && (
          <div className="mt-1 flex flex-col items-center gap-0.5">
            {item.children.map((child) => {
              const isChildActive = path === child.path || path.startsWith(child.path + '/');
              const ChildIcon = child.icon;
              return (
                <Tooltip key={child.href ?? child.label} label={child.label} show={true}>
                  <Link
                    href={child.href!}
                    className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-lg transition-all',
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
                        'w-4 h-4 transition-all duration-300',
                        isChildActive ? 'brightness-0 invert' : 'text-gray-500'
                      )}
                    />
                  </Link>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
      <WarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        title="Acceso Restringido"
        message={warningMessage}
      />
    </>
  );
};


// Componente para renderizar el menú (reutilizable)
const MenuContent = ({ onLinkClick, collapsed = false }: { onLinkClick?: () => void; collapsed?: boolean }) => {
  const path = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach(item => {
      if ('children' in item && item.children) {
        initial[item.label] = true;
      }
    });
    return initial;
  });
  const { user } = useUserStore();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const isAdmin = user?.is_staff || user?.is_superuser;

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !(prev[label] ?? true)
    }));
  };

  useEffect(() => {
    menuItems.forEach(item => {
      if ('children' in item && item.children) {
        const isChildActive = item.children.some(child => child.path === path);

        if (isChildActive) {
          setOpenMenus(prev => {
            if (prev[item.label] !== undefined) return prev;
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

  // ──────────────────────────────────────────────────────
  // Collapsed mode: icons only with tooltips / flyout
  // ──────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <ul className='flex flex-col items-center gap-1 pt-2 pb-8'>
        {menuItems.map((item) => {
          const hasChildren = 'children' in item && item.children && item.children.length > 0;
          const itemPath = 'path' in item ? item.path : undefined;
          const isItemActive = isActive(itemPath);
          const Icon = item.icon;

          if (hasChildren) {
            return (
              <li key={item.label}>
                <CollapsedSubmenu
                  item={item as MenuItemGroup}
                  isActive={isActive}
                  path={path}
                  onLinkClick={onLinkClick}
                />
              </li>
            );
          }

          return (
            <li key={item.label}>
              <Tooltip label={item.label} show={true}>
                <Link
                  href={item.href!}
                  onClick={onLinkClick}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-all cursor-pointer',
                    isItemActive ? 'bg-property_purple text-white' : 'hover:bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 text-gray-700 transition-all duration-300',
                      isItemActive && 'brightness-0 invert'
                    )}
                  />
                </Link>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    );
  }

  // ──────────────────────────────────────────────────────
  // Expanded mode: full menu (original)
  // ──────────────────────────────────────────────────────
  return (
    <ul className='mr-auto ml-auto max-w-[220px] w-full pb-8'>
      {menuItems.map((item) => {
        const hasChildren = 'children' in item && item.children && item.children.length > 0;
        const itemPath = 'path' in item ? item.path : undefined;
        const isItemActive = isActive(itemPath);
        const isOpen = openMenus[item.label] ?? true;

        const Icon = item.icon;

        return (
          <li key={item.label} className='mb-1'>
            <div className='flex flex-col'>
              {hasChildren ? (
                <button
                  type="button"
                  className={cn(
                    'group flex items-center px-5 py-2 gap-1 rounded-lg transition-all cursor-pointer w-full text-left',
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
                </button>
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
  const { isCollapsed } = useSidebarStore();

  return (
    <nav
      className={cn(
        'hidden bg-white lg:flex flex-col h-full pr-4 pl-4 text-second_text_color relative z-10 shadow-xl transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[68px] px-2' : 'w-[250px]'
      )}
    >
      <div className='flex-1 overflow-y-auto pt-4 pb-6'>
        <MenuContent collapsed={isCollapsed} />
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
      <button
        type="button"
        className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden border-none p-0 m-0 w-full outline-none cursor-default'
        onClick={onClose}
        aria-label='Cerrar menú'
      />
      {/* Sidebar */}
      <nav className='fixed left-0 top-0 h-screen w-[280px] bg-white z-50 shadow-xl lg:hidden flex flex-col'>
        <div className='flex items-center justify-between p-4 border-b flex-shrink-0'>
          <h2 className='text-lg font-semibold'>Menú</h2>
          <button type='button'
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