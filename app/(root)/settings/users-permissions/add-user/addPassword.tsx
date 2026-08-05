"use client"

import { useState } from 'react'
import { Eye, EyeOff, Save } from 'lucide-react'
import { UserForm } from '@/lib/@type'
import { ChangePassword } from '@/lib/api/auth/auth-api'
import { showToast } from 'nextjs-toast-notify'

interface AddPasswordProps {
    user: UserForm;
    setUser: React.Dispatch<React.SetStateAction<UserForm>>;
    errors: Partial<UserForm>;
    isEdit?: boolean;
}

const PasswordField = ({
    id,
    label,
    value,
    onChange,
    error,
    required,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (val: string) => void;
    error?: string;
    required?: boolean;
}) => {
    const [show, setShow] = useState(false)
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full h-[40px] border rounded-lg px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary_color/30 focus:border-primary_color transition-all ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

export const AddPassword = ({ user, setUser, errors, isEdit = false }: AddPasswordProps) => {
    const set = (field: keyof UserForm) => (val: string) => setUser(prev => ({ ...prev, [field]: val }))
    const [isChanging, setIsChanging] = useState(false)

    const handleChangePassword = async () => {
        if (!user.password || (isEdit && !user.old_password)) {
            showToast.warning("Por favor completa los campos de contraseña")
            return
        }
        if (user.password.length < 8) {
            showToast.warning("La contraseña debe tener al menos 8 caracteres")
            return
        }

        setIsChanging(true)
        try {
            await ChangePassword({
                old_password: user.old_password || "",
                new_password: user.password,
            } as any)
            showToast.success("Contraseña actualizada correctamente")
            setUser(prev => ({ ...prev, old_password: "", password: "" }))
        } catch (error: any) {
            const msg = error?.response?.data?.detail || error?.response?.data?.old_password?.[0] || "Error al actualizar la contraseña"
            showToast.error(msg)
        } finally {
            setIsChanging(false)
        }
    }

    return (
        <div className='w-full max-h-max rounded-xl p-4 sm:p-6 border border-slate-200 bg-white shadow-sm mt-4'>
            <h2 className='font-semibold text-lg text-gray-900'>Seguridad de la cuenta</h2>
            <p className='text-sm text-gray-500 mt-0.5'>
                {isEdit
                    ? 'Para cambiar la contraseña, ingresa la actual y la nueva. Déjalos vacíos si no deseas modificarla.'
                    : 'Establece la contraseña de acceso para este usuario.'}
            </p>

            <div className={`mt-5 grid gap-4 ${isEdit ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-1 max-w-xs'}`}>
                {isEdit && (
                    <PasswordField
                        id="old_password"
                        label="Contraseña actual"
                        value={(user as any).old_password || ''}
                        onChange={set('old_password' as keyof UserForm)}
                        error={(errors as any).old_password}
                    />
                )}
                <PasswordField
                    id="password"
                    label={isEdit ? 'Nueva contraseña' : 'Contraseña'}
                    value={user.password || ''}
                    onChange={set('password')}
                    error={errors.password as string}
                    required={!isEdit}
                />
            </div>

            <div className="flex justify-end mt-5">
                <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isChanging}
                    className="bg-primary_color text-white h-[40px] px-6 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-medium shadow-md text-sm disabled:opacity-60"
                >
                    <Save size={16} />
                    {isChanging ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
            </div>
        </div>
    )
}

export default AddPassword
