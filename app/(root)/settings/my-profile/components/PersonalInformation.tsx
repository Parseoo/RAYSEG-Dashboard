"use client"

import { User as UserType } from "@/lib/@type"

interface PersonalInformationProps {
    user?: UserType | null;
}

export const PersonalInformation = ({ user }: PersonalInformationProps) => {

    return (
        <div className="bg-white rounded-lg p-6 border shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Información Personal</h2>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between border-b pb-3 border-gray-100 last:border-0 last:pb-0">
                    <span className="text-gray-500 font-medium">Nombre completo</span>
                    <span className="text-gray-900 font-semibold text-right">{user?.name} {user?.paternal_last_name} {user?.maternal_last_name}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between border-b pb-3 border-gray-100 last:border-0 last:pb-0">
                    <span className="text-gray-500 font-medium">Email corporativo</span>
                    <span className="text-gray-900 font-semibold text-right">{user?.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between border-b pb-3 border-gray-100 last:border-0 last:pb-0">
                    <span className="text-gray-500 font-medium">Teléfono móvil</span>
                    <span className="text-gray-900 font-semibold text-right">{user?.phone || '+52 55 1234 5678'}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between border-b pb-3 border-gray-100 last:border-0 last:pb-0">
                    <span className="text-gray-500 font-medium">Teléfono oficina</span>
                    <span className="text-gray-900 font-semibold text-right">+52 55 9876 5432 ext. 101</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between border-b pb-3 border-gray-100 last:border-0 last:pb-0">
                    <span className="text-gray-500 font-medium">ID de Agente</span>
                    <span className="text-gray-900 font-semibold text-right">AGT-{user?.id || '2021-007'}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-3 border-gray-100 last:border-0 last:pb-0">
                    <span className="text-gray-500 font-medium">Estado de cuenta</span>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {user?.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>
        </div>
    )
}
