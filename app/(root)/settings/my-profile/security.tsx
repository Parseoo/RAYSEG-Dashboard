"use client"

import { useState } from 'react'

export const SecuritySettings = () => {
    const [password, setPassword] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="mt-4 w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
            </label>

            <div className="relative w-full">
                <input id="password" type="password" placeholder="Ingresa tu nueva contraseña"
                    disabled={!isEditing} value={password} onChange={(e) => setPassword(e.target.value)} className={`
            w-full pl-4 pr-40 py-2 rounded-lg outline-none transition-all border border-gray-300 focus:ring-2
            ${!isEditing ? 'text-gray-400 cursor-not-allowed' : ''} `} />
                <button type="button" onClick={() => setIsEditing(prev => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2
            px-3 py-1 text-sm rounded-md
            border border-gray-300
            bg-primary_color text-white
            transition">
                    {isEditing ? 'Cancelar' : 'Cambiar contraseña'}
                </button>
            </div>

            <p className="text-gray-500 mt-1">
                Se enviará un correo con el enlace para actualizar tu contraseña.
            </p>
        </div>
    )
}

export default SecuritySettings
