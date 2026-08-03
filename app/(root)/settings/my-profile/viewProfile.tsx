"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { GetProfileApi } from "@/lib/api/auth/auth-api"
import { User } from "@/lib/@type"
import { Share2, Pencil } from "lucide-react"

interface ProfileHeaderProps {
    user?: User | null;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarPreview, setAvatarPreview] = useState("/casa.jpeg")

    const handleOpenFile = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        setAvatarPreview(previewUrl)
    }

    return (
        <div className="w-full bg-white rounded-lg p-6 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-gray-100">
                        <Image
                            src={avatarPreview}
                            alt="avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* <button
                        type="button"
                        onClick={handleOpenFile}
                        className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border hover:bg-gray-50 transition-colors"
                    >
                        <Pencil size={14} className="text-gray-600" />
                    </button> */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user?.name} {user?.paternal_last_name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 font-medium">{user?.role}</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            {user?.role || 'Agente'}
                        </span>
                    </div>


                    <div className="flex flex-col gap-1 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center">
                                    <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                                </span>
                                {user?.state}, {user?.city}
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center">
                                    <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                                </span>
                                Miembro desde el {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center">
                                    <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                                </span>
                                Último acceso: {user?.last_access_date ? new Date(user.last_access_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center">
                                    <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                                </span>
                                Último cambio de contraseña: {user?.last_password_change ? new Date(user?.last_password_change).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary_color text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    <Pencil size={16} />
                    Editar perfil
                </button>
            </div>*/}
        </div>
    )
}

export default ProfileHeader

