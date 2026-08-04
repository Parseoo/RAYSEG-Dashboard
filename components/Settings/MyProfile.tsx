"use client";

import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ProfileHeader } from '@/app/(root)/settings/my-profile/viewProfile';
import { PersonalInformation } from '@/app/(root)/settings/my-profile/components/PersonalInformation';
import { AddressInformation } from '@/app/(root)/settings/my-profile/components/AddressInformation';
import { ProfessionalProfile } from '@/app/(root)/settings/my-profile/components/ProfessionalProfile';
import SecuritySettings from '@/app/(root)/settings/my-profile/security';
import { GetProfileApi } from '@/lib/api/auth/auth-api';
import { useUserStore } from '@/lib/store/userStore';
import { User } from '@/lib/@type';

const MyProfile = () => {
    const { user: storeUser } = useUserStore();
    const [user, setUser] = useState<User | null>(storeUser || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const authResponse = await GetProfileApi();
                const authData = ((authResponse?.data as any)?.data || authResponse?.data) as User;

                if (authData) {
                    setUser(authData);
                    useUserStore.setState((state) => ({
                        ...state,
                        user: { ...state.user, ...authData }
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="w-full max-w-[1440px] mx-auto pb-12">
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Configuración', href: '/settings/users-permissions' },
                { label: 'Mi Perfil', href: '/settings/my-profile', active: true }
            ]} />

            <div className="flex flex-col gap-6">
                <ProfileHeader user={user} />

                {/* Información Personal y Ubicación lado a lado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <PersonalInformation user={user} />
                    <AddressInformation user={user} />
                </div>

                {/* Perfil Profesional y Notas a todo el ancho */}
                <ProfessionalProfile user={user} />

                {/* Seguridad y Acceso a todo el ancho */}
                <SecuritySettings />
            </div>
        </div>
    );
};

export default MyProfile;
