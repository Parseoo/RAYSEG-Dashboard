"use client";

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import Breadcrumb from '@/components/ui/breadcrumb';

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
                { label: 'Configuración', href: '/settings', active: true }
            ]} />
            <div>
                <h1 className='text-black font-[700] text-3xl mb-6'>Mi Perfil</h1>
                <div>

                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>

            </div>
        </>
    );
};

export default MyProfile;
