"use client"

import React from 'react';
import Breadcrumb from "@/components/ui/breadcrumb"
import { Save } from 'lucide-react';
import { AddInformationPersonal } from './addInformationPersonal';
import AddPermissions from './addPermissions';
import AddPassword from './addPassword';

const AddUser = () => {
    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Configuración', href: '/settings' },
                { label: 'Usuarios y Permisos', href: '/settings/users-permissions' },
                { label: 'Agregar Usuario', href: '/settings/users-permissions/add-user', active: true }
            ]} />
            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Registrar nuevo usuario</h1>
                            <p className='text-md text-gray-500'>Crea una cuenta para un nuevo integrante de tu inmobiliaria y define sus permisos pantalla por pantalla.</p>
                        </div>
                    </div>
                    <AddInformationPersonal />
                    <AddPermissions  data={[]} isLoading={false}/>
                    <AddPassword />
                    <div className='flex gap-4 justify-end'>
                        <button type='button'
                            className='bg-slate-100 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
                            Guardar borrador
                        </button>
                        <button type='button'
                            className='bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium'>
                            <Save size={20} /> Guardar Usuario
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser;