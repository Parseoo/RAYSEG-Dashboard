"use client"

import { useState } from 'react'
import { Eye, EyeOff, Lock, Save } from 'lucide-react'
import { ResetPasswordApi } from '@/lib/api/auth/auth-api'
import { showToast } from 'nextjs-toast-notify'

const PasswordField = ({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (v: string) => void }) => {
    const [show, setShow] = useState(false)
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[40px] border border-gray-200 rounded-lg px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary_color/30 focus:border-primary_color transition-all"
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    )
}

export const SecuritySettings = () => {
    const [form, setForm] = useState({ old_password: '', new_password: '', new_password_confirm: '' })
    const [isSaving, setIsSaving] = useState(false)

    const handleChange = (field: string) => (value: string) => setForm(f => ({ ...f, [field]: value }))

    const handleSubmit = async () => {
        if (!form.old_password || !form.new_password || !form.new_password_confirm) {
            showToast.warning("Por favor completa todos los campos")
            return
        }
        if (form.new_password !== form.new_password_confirm) {
            showToast.error("Las contraseñas nuevas no coinciden")
            return
        }
        if (form.new_password.length < 8) {
            showToast.warning("La nueva contraseña debe tener al menos 8 caracteres")
            return
        }

        setIsSaving(true)
        try {
            await ResetPasswordApi({
                old_password: form.old_password,
                new_password: form.new_password,
                new_password_confirm: form.new_password_confirm,
            })
            showToast.success("Contraseña actualizada correctamente")
            setForm({ old_password: '', new_password: '', new_password_confirm: '' })
        } catch (error: any) {
            const msg = error?.response?.data?.detail || error?.response?.data?.old_password?.[0] || "Error al actualizar la contraseña"
            showToast.error(msg)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='bg-white rounded-lg p-6 border shadow-sm'>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Lock size={20} />
                </div>
                <div>
                    <h2 className='text-lg font-bold text-gray-900'>Seguridad y Acceso</h2>
                    <p className='text-xs text-gray-500'>Actualiza tu contraseña de inicio de sesión</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PasswordField label="Contraseña actual" id="old_password" value={form.old_password} onChange={handleChange('old_password')} />
                <PasswordField label="Nueva contraseña" id="new_password" value={form.new_password} onChange={handleChange('new_password')} />
                <PasswordField label="Confirmar nueva contraseña" id="new_password_confirm" value={form.new_password_confirm} onChange={handleChange('new_password_confirm')} />
            </div>

            {form.new_password && form.new_password_confirm && form.new_password !== form.new_password_confirm && (
                <p className="text-xs text-red-500 mt-2">Las contraseñas nuevas no coinciden</p>
            )}

            <div className="flex justify-end mt-5">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="bg-primary_color text-white h-[40px] px-6 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-medium shadow-md text-sm disabled:opacity-60"
                >
                    <Save size={16} />
                    {isSaving ? 'Guardando...' : 'Actualizar contraseña'}
                </button>
            </div>
        </div>
    )
}

export default SecuritySettings
