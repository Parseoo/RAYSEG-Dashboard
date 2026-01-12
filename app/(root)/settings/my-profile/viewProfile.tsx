"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { DynamicInputs } from "@/components/ui/Input"
import { inputsProfile } from "../inputConfig"

export const AddProfile = () => {
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
        <div className="w-full max-h-max rounded-lg p-5 border">
            <h1 className="font-[500] text-lg">Perfil del Agente</h1>
            <p className="text-md text-gray-500">
                Datos visibles en las fichas de propiedades en la web.
            </p>

            {/* Avatar + botón */}
            <div className="mt-6 flex items-start gap-4">
                {/* Avatar */}
                <div className="relative w-24 h-24 overflow-hidden bg-neutral-secondary-medium rounded-full">
                    <Image
                        src={avatarPreview}
                        alt="avatar"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Botón + texto */}
                <div className="flex flex-col gap-1 mt-5">
                    <button
                        type="button"
                        onClick={handleOpenFile}
                        className="bg-primary_color text-white w-[270px] h-[30px] rounded-lg
                     flex items-center justify-center gap-2 px-4
                     hover:opacity-90 transition-opacity font-medium"
                    >
                        Cambiar foto
                    </button>

                    <p className="text-sm text-gray-500 mt-2">
                        Recomendado: 400x400px, JPG o PNG, máximo 2 MB.
                    </p>
                </div>

                {/* Input file oculto */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Inputs dinámicos */}
            <div className="mt-4">
                <DynamicInputs inputs={inputsProfile} withBgWhite={true} />
            </div>

            {/* Stats */}
            <div className="flex gap-x-8 mt-4">
                <div className="flex">
                    <strong className="mr-2">Propiedades activas:</strong>
                    <p>24</p>
                </div>

                <div className="flex">
                    <strong className="mr-2">Propiedades vendidas:</strong>
                    <p>18</p>
                </div>
            </div>
        </div>
    )
}

export default AddProfile
