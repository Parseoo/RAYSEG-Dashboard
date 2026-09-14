import { useUserStore } from '@/lib/store/userStore';
import React from 'react';

/**
 * Hook para comprobar permisos del usuario activo
 */
export const usePermissions = () => {
    const { permissions, user } = useUserStore();

    const hasPermission = (codename: string) => {
        if (!permissions) return false;
        
        // El superuser tiene todos los permisos por defecto
        if (user?.is_superuser) return true;

        return permissions.includes(codename);
    };

    const hasAnyPermission = (codenames: string[]) => {
        if (!permissions) return false;
        if (user?.is_superuser) return true;
        return codenames.some(codename => permissions.includes(codename));
    };

    const hasAllPermissions = (codenames: string[]) => {
        if (!permissions) return false;
        if (user?.is_superuser) return true;
        return codenames.every(codename => permissions.includes(codename));
    };

    return { hasPermission, hasAnyPermission, hasAllPermissions, permissions };
};

/**
 * Componente Wrapper para ocultar elementos de la UI si el usuario no tiene permisos
 */
interface RequirePermissionProps {
    codename: string | string[];
    requireAll?: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({ 
    codename, 
    requireAll = false, 
    children, 
    fallback = null 
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    const hasAccess = Array.isArray(codename)
        ? (requireAll ? hasAllPermissions(codename) : hasAnyPermission(codename))
        : hasPermission(codename);

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
