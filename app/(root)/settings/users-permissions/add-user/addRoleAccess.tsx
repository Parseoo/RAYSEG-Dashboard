"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/Switch';
import { UserForm } from '@/lib/@type';

interface AddRoleAccessProps {
    user: UserForm;
    setUser: React.Dispatch<React.SetStateAction<UserForm>>;
    roles: any[];
    isLoading?: boolean;
}

export const AddRoleAccess = ({ user, setUser, roles, isLoading }: AddRoleAccessProps) => {

    const handleRoleChange = (roleValue: string) => {
        setUser(prev => ({ ...prev, role: roleValue }));
    };

    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Rol de acceso</h1>
                            <p className='text-md text-gray-500'>Selecciona el perfil general del usuario.</p>
                           
                            <div className='mt-6'>
                                <label className='block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2'>
                                    Perfil asignado
                                </label>
                                <Select value={String(user.role)} onValueChange={handleRoleChange} disabled={isLoading}>
                                    <SelectTrigger className="w-full h-12 bg-white border-slate-200 text-slate-700">
                                        <SelectValue placeholder="Selecciona un rol..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={String(role.id || role.name).toLowerCase()}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>



    );
};
