import React from 'react';
import { Table } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/Checkbox';

const headers = [
    'Pantalla / Sección',
    'Ver',
    'Crear',
    'Editar',
    'Eliminar'
];

const defaultScreens = [
    { id: 'reportes', name: 'Reportes' },
    { id: 'propiedades', name: 'Propiedades' },
    { id: 'clientes', name: 'Clientes' },
    { id: 'agentes', name: 'Agentes' },
    { id: 'home', name: 'Home' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'localizacion', name: 'Localización' },
    { id: 'sobre-nosotros', name: 'Sobre Nosotros' },
    { id: 'footer', name: 'Footer' },
    { id: 'paginas-legales', name: 'Paginas Legales' },
    { id: 'mi-perfil', name: 'Mi Perfil' },
    { id: 'usuarios-permisos', name: 'Usuarios y Permisos' },
];

function AddPermissions({ data, isLoading }: { data: any[]; isLoading: boolean }) {

    const tableData = (data && data.length > 0) ? data : defaultScreens;

    const renderRow = (row: any, index: number) => (
        <tr key={row.id || index} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
            <td className='py-4 px-4 text-sm font-medium text-gray-700'>
                {row.name || row.Screen || 'N/A'}
            </td>
            <td className='py-4 px-4'>
                <div className='flex items-center justify-center'>
                    <Checkbox className='w-4 h-4' />
                </div>
            </td>
            <td className='py-4 px-4'>
                <div className='flex items-center justify-center'>
                    <Checkbox className='w-4 h-4' />
                </div>
            </td>
            <td className='py-4 px-4'>
                <div className='flex items-center justify-center'>
                    <Checkbox className='w-4 h-4' />
                </div>
            </td>
            <td className='py-4 px-4'>
                <div className='flex items-center justify-center'>
                    <Checkbox className='w-4 h-4' />
                </div>
            </td>
        </tr>
    )

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                        <h1 className='font-[500] text-lg'>Permisos por pantalla</h1>
                        <p className='text-md text-gray-500 mb-4'>Define los permisos de este usuario de forma individual. Cada fila corresponde a una pantalla o sección específica del Dashboard.</p>

                        <div className='mt-4 overflow-x-auto'>
                            <Table data={tableData} headers={headers} renderRow={renderRow} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPermissions;