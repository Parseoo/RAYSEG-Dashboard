"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import Image from 'next/image';
import { getUserImageUrl } from '@/lib/utils';
import { ViewPermissions } from '../add-user/viewPermissions';
import { GetUsersById } from '@/lib/api/user-api';
import { GetListRoles } from '@/lib/api/permission-api';
import { UserResponse } from '@/lib/@type';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;
    
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await GetUsersById(Number(userId));
                setUserData(response.data);
            } catch (err: any) {
                console.error("Error fetching user details:", err);
                setError(err?.response?.data?.detail || "No se pudo cargar la información del usuario");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await GetListRoles();
                const items = res.data?.items || res.data?.catalogItems || res.data?.data || [];
                setRoles(items);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    // Get role name from API roles
    const getRoleName = (role: any) => {
        if (typeof role === 'object' && role !== null) {
            return role.name;
        }
        const found = roles.find(r => String(r.id) === String(role));
        return found ? found.name : role;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
                <p className="text-gray-500 font-medium">Cargando información del usuario...</p>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                    <p className="text-red-600 font-medium mb-4">{error || "Usuario no encontrado"}</p>
                    <button 
                        onClick={() => router.push('/settings/users-permissions')}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    const userRoleLabel = userData.role ? getRoleName(userData.role) : (userData.is_superuser ? 'SuperAdmin' : userData.is_staff ? 'Administrador' : 'Usuario');

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Configuración', href: '/settings' },
                { label: 'Usuarios y Permisos', href: '/settings/users-permissions' },
                { label: 'Ver usuario', href: `/settings/users-permissions/${userId}`, active: true }
            ]} />

            <div className='mb-4'>
                <button
                    onClick={() => router.back()}
                    className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'
                >
                    <ArrowLeft size={18} />
                    <span className='text-sm'>Volver</span>
                </button>
            </div>

            {/* RESUMEN DE ROL */}
            <div className='bg-slate-50 rounded-lg p-5 mb-6 border border-slate-200'>
                <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>RESUMEN DE ROL</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Rol asignado</p>
                        <p className='text-base font-semibold text-gray-800'>{userRoleLabel}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Estado</p>
                        <Tag status={userData.is_active ? 'Activo' : 'Inactivo'}>{userData.is_active ? 'Activo' : 'Inactivo'}</Tag>
                    </div>
                </div>
            </div>

            {/* INFORMACIÓN DEL USUARIO */}
            <div className='bg-white rounded-lg p-5 mb-6 shadow-md border border-slate-200'>
                <div className='flex items-center gap-4 mb-5 pb-4 border-b border-slate-100'>
                    <div className='relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0 border'>
                        <Image 
                            src={getUserImageUrl(userData.profile_picture)} 
                            alt={userData.name} 
                            fill
                            sizes="64px"
                            unoptimized={true}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target && !target.src.endsWith('/user.svg')) {
                                    target.src = '/user.svg';
                                }
                            }}
                            className='object-cover'
                        />
                    </div>
                    <div>
                        <h1 className='text-lg font-bold text-gray-900'>{userData.name} {userData.paternal_last_name} {userData.maternal_last_name || ''}</h1>
                        <p className='text-sm text-gray-500'>{userData.email}</p>
                    </div>
                </div>
                <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>INFORMACIÓN DETALLADA</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Nombre completo</p>
                        <p className='text-sm font-medium text-gray-800'>{userData.name} {userData.paternal_last_name} {userData.maternal_last_name || ''}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Correo electrónico</p>
                        <p className='text-sm font-medium text-gray-800'>{userData.email}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>ID de usuario</p>
                        <p className='text-sm font-medium text-gray-800'>#{userData.id}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Fecha de actualización</p>
                        <p className='text-sm font-medium text-gray-800'>{new Date(userData.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Estado</p>
                        <p className='text-sm font-medium text-gray-800'>{userData.address?.state || '-'}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Ciudad</p>
                        <p className='text-sm font-medium text-gray-800'>{userData.address?.city || '-'}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Colonia</p>
                        <p className='text-sm font-medium text-gray-800'>{userData.address?.neighborhood || '-'}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Código postal</p>
                        <p className='text-sm font-medium text-gray-800'>{userData.address?.postal_code || '-'}</p>
                    </div>
                </div>
            </div>

            {/* PERMISOS POR PANTALLA */}
            {/* Se asume que permissions viene incluido en userData o se maneja por ViewPermissions */}
            <ViewPermissions userPermissions={(userData as any).permissions || {}} isReadOnly={true} />
        </>
    );
}
