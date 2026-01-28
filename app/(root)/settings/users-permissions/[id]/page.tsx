"use client"

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { ViewPermissions } from '../add-user/viewPermissions';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;

    // Mock data - en producción esto vendría de una API
    const mockUserData = {
        id: userId,
        name: 'Juan Pérez',
        email: 'juan.perez@inmogestion.mx',
        role: 'Agente Inmobiliario',
        status: 'Activo',
        permissions: {
            'reportes': true,
            'propiedades': true,
            'imagenes-propiedades': true,
            'clientes': true,
            'agentes': false,
            'contratos': true,
            'leads-contacto': true,
            'contenido-web-home': false,
            'contenido-web-servicios': false,
            'contenido-web-localizacion': false,
            'contenido-web-sobre-nosotros': false,
            'contenido-web-footer': false,
            'contenido-web-legal': false,
            'mi-perfil': true,
            'ajustes-usuarios': false
        }
    };

    const userData = mockUserData;

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
                        <p className='text-base font-semibold text-gray-800'>{userData.role}</p>
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Estado</p>
                        <Tag status={userData.status}>{userData.status}</Tag>
                    </div>
                </div>
            </div>

            {/* INFORMACIÓN DEL USUARIO */}
            <div className='bg-white rounded-lg p-5 mb-6 shadow-md border border-slate-200'>
                <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>INFORMACIÓN DEL USUARIO</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Nombre completo</p>
                        <p className='text-sm font-medium text-gray-800'>{userData.name}</p>
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
                        <p className='text-xs text-gray-500 mb-1'>Fecha de registro</p>
                        <p className='text-sm font-medium text-gray-800'>15 enero 2024</p>
                    </div>
                </div>
            </div>

            {/* PERMISOS POR PANTALLA */}
            <ViewPermissions userPermissions={userData.permissions} isReadOnly={true} />
        </>
    );
}
