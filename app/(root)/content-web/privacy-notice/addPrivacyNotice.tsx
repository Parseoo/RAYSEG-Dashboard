"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsPrivacyNotice } from "../inputConfig"
import { Info } from "lucide-react"

export const AddPrivacyNotice = () => {
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
                <h1 className='font-[500] text-lg'>Datos del Aviso de Privacidad</h1>
                <p className='text-md text-gray-500'>
                    Configura el título y el texto que conforman el aviso de privacidad.
                </p>

                <div className="mt-4">
                    <DynamicInputs inputs={inputsPrivacyNotice} withBgWhite={true} />
                </div>

                <p className="text-sm text-gray-500 mt-2 self-end text-right">
                    Se recomienda consultar con un asesor legal para validar este contenido.
                </p>
            </div>

        </>
    )
}