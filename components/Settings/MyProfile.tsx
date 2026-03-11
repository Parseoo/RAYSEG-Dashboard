"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/lib/api/auth/auth-query';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Save } from 'lucide-react';
import { ProfileHeader } from '@/app/(root)/settings/my-profile/viewProfile';
import { PersonalInformation } from '@/app/(root)/settings/my-profile/components/PersonalInformation';
import { ProfessionalProfile } from '@/app/(root)/settings/my-profile/components/ProfessionalProfile';
import SecuritySettings from '@/app/(root)/settings/my-profile/security';
import { GetProfileApi } from '@/lib/api/auth/auth-api';
import { UserResponse } from '@/lib/@type';

const MyProfile = () => { // trae la función logout desde el store global de usuario
    const [user, setUser] = useState<UserResponse | null>(null);
    const { mutate: logout } = useLogout();

    useEffect(() => { // función async para obtener el perfil del usuario
        const fetchProfile = async () => {
            try {
                // llamada al endpoint
                const response = await GetProfileApi();
                // valida que exista respuesta y datos
                if (response && response.data) {
                    console.log("response.data", response.data);
                    // guarda los datos del usuario en el estado
                    setUser(response.data);
                }
            } catch (error) {
                // muestra el error en consola si falla la petición
                console.error("Error fetching profile", error);
            }
        };
        // ejecuta la función cuando el componente monta
        fetchProfile();
    }, []); // array vacío: se ejecuta una sola vez

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Configuración', href: '/settings', active: true },
                { label: 'Mi Perfil', href: '/my-profile', active: true }
            ]} />
            <div className='w-full max-h-max mb-9'>
                <div className="flex flex-col gap-6">
                    <ProfileHeader user={user} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PersonalInformation user={user} />
                        <ProfessionalProfile user={user} />
                    </div>

                    <div className="bg-white rounded-lg p-6 border shadow-sm">
                        <SecuritySettings />
                    </div>
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
        </>
    );
};

export default MyProfile;
