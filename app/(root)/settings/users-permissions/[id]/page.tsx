"use client"

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { ArrowLeft } from 'lucide-react';
import { ViewPermissions } from '../add-user/viewPermissions';

// Datos de ejemplo - en producción vendrían de una API
const mockUserData = {
    id: 1,
    name: 'Ana Martínez',
    email: 'ana.m@inmogestion.mx',
    phone: '+52 55 1234 5678',
    status: 'Activo',
    lastAccess: 'Hoy · 09:20 h',
    createdAt: '15 feb 2024',
    workArea: 'CDMX · Zona Poniente',
    propertiesInCharge: '24 activas · 8 en borrador',
    userType: 'Interno · Agente',
    role: {
        title: 'Agente inmobiliario',
        description: 'Rol pensado para asesores que gestionan propiedades y leads.',
        status: 'Activo',
        type: 'Rol predefinido',
        basePermissions: 'Ver y editar propiedades propias',
        assignedProperties: '24 activas'
    },
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

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;

    // En producción, aquí harías un fetch del usuario por ID
    const userData = mockUserData;

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Usuarios y Permisos', href: '/settings/users-permissions' },
                { label: 'Detalle de Usuario', href: `/settings/users-permissions/${userId}`, active: true }
            ]} />

            {/* Botón volver */}
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
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                    <div className='flex-1'>
                        <h2 className='font-bold text-xl text-gray-800 mb-2'>{userData.role.title}</h2>
                        <p className='text-sm text-gray-600 mb-4'>{userData.role.description}</p>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
                            <div>
                                <span className='text-gray-500'>Tipo:</span>
                                <span className='ml-2 text-gray-800 font-medium'>{userData.role.type}</span>
                            </div>
                            <div>
                                <span className='text-gray-500'>Permisos base:</span>
                                <span className='ml-2 text-gray-800 font-medium'>{userData.role.basePermissions}</span>
                            </div>
                            <div>
                                <span className='text-gray-500'>Propiedades asignadas:</span>
                                <span className='ml-2 text-gray-800 font-medium'>{userData.role.assignedProperties}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex-shrink-0'>
                        <Tag status={userData.role.status} statusType='property'>
                            {userData.role.status}
                        </Tag>
                    </div>
                </div>
            </div>

            {/* INFORMACIÓN DEL USUARIO */}
            <div className='bg-white rounded-lg p-5 mb-6 shadow-md border border-slate-200'>
                <h2 className='font-bold text-xl text-gray-800 mb-4'>Información del Usuario</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm'>
                    <div>
                        <span className='text-gray-500 block mb-1'>Correo</span>
                        <span className='text-gray-800 font-medium'>{userData.email}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 block mb-1'>Teléfono</span>
                        <span className='text-gray-800 font-medium'>{userData.phone}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 block mb-1'>Estado</span>
                        <Tag status={userData.status} statusType='property'>
                            {userData.status}
                        </Tag>
                    </div>
                    <div>
                        <span className='text-gray-500 block mb-1'>Último acceso</span>
                        <span className='text-gray-800 font-medium'>{userData.lastAccess}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 block mb-1'>Creado el</span>
                        <span className='text-gray-800 font-medium'>{userData.createdAt}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 block mb-1'>Zona de trabajo</span>
                        <span className='text-gray-800 font-medium'>{userData.workArea}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 block mb-1'>Propiedades a cargo</span>
                        <span className='text-gray-800 font-medium'>{userData.propertiesInCharge}</span>
                    </div>
                    <div>
                        <span className='text-gray-500 block mb-1'>Tipo de usuario</span>
                        <span className='text-gray-800 font-medium'>{userData.userType}</span>
                    </div>
                </div>
                <p className='mt-4 text-xs text-gray-500 italic'>
                    Los datos de acceso (correo, contraseña) se administran desde "Mi perfil" o por un administrador.
                </p>
            </div>

            {/* PERMISOS POR PANTALLA */}
            <ViewPermissions userPermissions={userData.permissions} isReadOnly={true} />
        </>
    );
}
