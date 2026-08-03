"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsPrivacyNotice } from "../inputConfig"
import { Info } from "lucide-react"
import { RichTextEditor } from "@/components/ui/RichTextEditor"

import React from "react"

interface AddPrivacyNoticeProps {
    data: {
        privacy_title: string;
        privacy_content: string;
    };
    onChange: (id: string, value: string) => void;
}

export const AddPrivacyNotice = ({ data, onChange }: AddPrivacyNoticeProps) => {
    const titleInput = inputsPrivacyNotice[0]
    const mappedTitleInput = {
        ...titleInput,
        value: (data as any)[titleInput.id] || "",
        onChange: (val: any) => {
            const value = val?.target ? val.target.value : val;
            onChange(titleInput.id, value);
        }
    }

    return (
        <>
            <div className='bg-blue-50 w-full rounded-lg p-5 flex items-start gap-3'>
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className='text-sm text-gray-500'>
                    Esta información es obligatoria en México para cumplir con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                    Se generará un enlace automático en el pie de página de tu sitio web.
                </p>
            </div>

            <div className='w-full max-h-max rounded-lg p-5 border flex flex-col'>
                <div className='flex justify-between items-center mb-2'>
                    <h1 className='font-[500] text-lg'>Datos del Aviso de Privacidad</h1>
                    <div className="flex items-center gap-2">
                        <Info className="flex-shrink-0 text-gray-500 w-4 h-4" />
                        <p className="text-gray-500 text-sm">Última actualización: 05 Ene 2025</p>
                    </div>
                </div>

                <p className='text-md text-gray-500'>
                    Configura el título y el texto que conforman el aviso de privacidad.
                </p>

                <div className="mt-4">
                    <DynamicInputs inputs={[mappedTitleInput]} withBgWhite={true} />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {inputsPrivacyNotice[1].label}
                    </label>
                    <RichTextEditor
                        value={data.privacy_content || ""}
                        onChange={(value) => onChange("privacy_content", value)}
                        placeholder="Escribe el contenido del aviso de privacidad..."
                    />
                </div>

                <p className="text-sm text-gray-500 mt-2 self-end text-right">
                    Se recomienda consultar con un asesor legal para validar este contenido.
                </p>
            </div>
        </>
    )
}