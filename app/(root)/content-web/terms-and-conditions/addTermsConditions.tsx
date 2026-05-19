"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsAddTermsConditions } from "../inputConfig"
import { Info } from "lucide-react"

import React, { useState } from "react"

export const AddTermsConditions = () => {
    const [termsData, setTermsData] = useState<Record<string, string>>({});

    const mappedInputs = inputsAddTermsConditions.map(input => ({
        ...input,
        value: termsData[input.id] || "",
        onChange: (val: any) => {
            const value = val?.target ? val.target.value : val;
            setTermsData(prev => ({ ...prev, [input.id]: value }));
        }
    }));

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border flex flex-col'>
                <div className='flex justify-between items-center mb-2'>
                    <h1 className='font-[500] text-lg'>Datos de los Términos y Condiciones</h1>
                    <div className="flex items-center gap-2">
                        <Info className="flex-shrink-0 text-gray-500 w-4 h-4" />
                        <p className="text-gray-500 text-sm">Última actualización: 05 Ene 2025</p>
                    </div>
                </div>

                <p className='text-md text-gray-500'>
                    Configura el título y el texto que conforman los términos y condiciones.
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