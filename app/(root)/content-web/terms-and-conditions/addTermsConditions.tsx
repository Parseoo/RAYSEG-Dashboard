"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsAddTermsConditions } from "../inputConfig"
import { Info } from "lucide-react"
import { RichTextEditor } from "@/components/ui/RichTextEditor"

import React from "react"

interface AddTermsConditionsProps {
    data: {
        terms_title: string;
        terms_content: string;
    };
    onChange: (id: string, value: string) => void;
}

export const AddTermsConditions = ({ data, onChange }: AddTermsConditionsProps) => {
    const titleInput = inputsAddTermsConditions[0]
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
                    <DynamicInputs inputs={[mappedTitleInput]} withBgWhite={true} />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {inputsAddTermsConditions[1].label}
                    </label>
                    <RichTextEditor
                        value={data.terms_content || ""}
                        onChange={(value) => onChange("terms_content", value)}
                        placeholder="Escribe el contenido de los términos y condiciones..."
                    />
                </div>

                <p className="text-sm text-gray-500 mt-2 self-end text-right">
                    Se recomienda consultar con un asesor legal para validar este contenido.
                </p>
            </div>
        </>
    )
}