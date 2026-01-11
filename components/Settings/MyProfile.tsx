"use client";

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Save } from 'lucide-react';
import { AddProfile } from '@/app/(root)/settings/my-profile/viewProfile';
import AccountSettings from '@/app/(root)/settings/my-profile/account';
import SecuritySettings from '@/app/(root)/settings/my-profile/security';

const MyProfile = () => {
    const { logout } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth')
    };

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Configuración', href: '/settings', active: true },
                { label: 'Mi Perfil', href: '/my-profile', active: true }
            ]} />
            <div className='bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <h1 className='font-[700] text-2xl'>Mi Perfil</h1>
                            <p className='text-md text-gray-500'>Revisa tu información como agente. Solo puedes actualizar tu foto y algunos detalles básicos.</p>
                        </div>

                    </div>
                    <div className='flex flex-col gap-6'>
                        <AddProfile />
                        <AccountSettings />
                        <SecuritySettings />
                    </div>

                    <div className="flex items-center mt-6">
                        <div className="flex items-center gap-4 justify-end w-full">
                            <button
                                type="button"
                                className="bg-slate-100 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium">
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium">
                                <Save size={20} /> Guardar
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default MyProfile;
