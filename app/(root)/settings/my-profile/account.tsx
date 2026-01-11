"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsAccount } from "../inputConfig"

export const AccountSettings = () => {
    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Datos de cuenta</h1>
                <p className='text-md text-gray-500'>Información del usuario dentro del sistema. No se edita desde esta pantalla.</p>

                <div className="mt-4">
                    <DynamicInputs inputs={inputsAccount} withBgWhite={true} />
                </div>
                <p className="text-gray-500">
                    Si necesitas cambiar el correo, contacta al administrador del sistema.
                </p>
                <div className="flex gap-x-8 mt-4">
                    <div className="flex">
                        <strong className="mr-2">Estado:</strong>
                        <p>Activo</p>
                    </div>
                    <div className="flex">
                        <strong className="mr-2">Miembro desde:</strong>
                        <p>15 Feb 2025</p>
                    </div>
                    <div className="flex">
                        <strong className="mr-2">último cambio de contraseña:</strong>
                        <p>15 Dic 2025</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountSettings;