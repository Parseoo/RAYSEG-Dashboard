"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsPrivacyNotice } from "../inputConfig"
import { Info } from "lucide-react"

import React, { useState } from "react"

export const AddPrivacyNotice = () => {
    const [privacyData, setPrivacyData] = useState<Record<string, string>>({});

    const mappedInputs = inputsPrivacyNotice.map(input => ({
        ...input,
        value: privacyData[input.id] || "",
        onChange: (val: any) => {
            const value = val?.target ? val.target.value : val;
            setPrivacyData(prev => ({ ...prev, [input.id]: value }));
        }
    }));

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
                    <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                </div>

                <p className="text-sm text-gray-500 mt-2 self-end text-right">
                    Se recomienda consultar con un asesor legal para validar este contenido.
                </p>
            </div>
        </>
    )
}