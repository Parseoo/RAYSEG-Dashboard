"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsProfile } from "../inputConfig"

export const AddProfile = () => {
    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Perfil del Agente</h1>
                <p className='text-md text-gray-500'>Datos visibles en las fichas de propiedades en la web.</p>

                <div className="mt-4">
                    <DynamicInputs inputs={inputsProfile} withBgWhite={true} />
                </div>
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
        </>
    )
}