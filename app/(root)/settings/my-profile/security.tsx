"use client"

import { useState } from 'react'
import { inputsSecurity } from '../inputConfig'
import { DynamicInputs } from '@/components/ui/Input'

export const SecuritySettings = () => {
    const [password, setPassword] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Seguridad</h1>
                <p className='text-md text-gray-500'>Gestiona la contraseña. Otros cambios se hacen por administración</p>

                <div className="mt-4">
                    <DynamicInputs inputs={inputsSecurity} withBgWhite={true} />
                </div>
                <p className="text-gray-500 mt-1">
                    Se enviará un correo con el enlace para actualizar tu contraseña.
                </p>
            </div>
        </>

    )
}

export default SecuritySettings
