"use client"

import { useState } from 'react'
import { DynamicInputs } from '@/components/ui/Input'
import { inputsPassword } from '../../inputConfig'
import { Checkbox } from '@/components/ui/Checkbox'

export const AddPassword = () => {

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Seguridad de la cuenta</h1>
                <p className='text-md text-gray-500'>Gestiona la contraseña. Otros cambios se hacen por administración</p>

                <div className="mt-4">
                    <DynamicInputs inputs={inputsPassword} withBgWhite={true} />
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <Checkbox className="w-4 h-4" />
                    <p className="text-gray-500">
                        Envia por correo eléctrónico usuario y contraseña.
                    </p>
                </div>
            </div>
        </>

    )
}

export default AddPassword
