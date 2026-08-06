"use client"

import { useState } from 'react'
import { Eye, EyeOff, Lock, Save, Clock, KeyRound } from 'lucide-react'
import { ChangePassword } from '@/lib/api/auth/auth-api'
import { showToast } from 'nextjs-toast-notify'
import { User } from '@/lib/@type'

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

export const SecuritySettings = ({ user }: { user?: User | null }) => {
    const [form, setForm] = useState({ old_password: '', new_password: '' })
    const [isSaving, setIsSaving] = useState(false)

    const handleChange = (field: string) => (value: string) => setForm(f => ({ ...f, [field]: value }))

    const handleSubmit = async () => {
        if (!form.old_password || !form.new_password) {
            showToast.warning("Por favor completa todos los campos")
            return
        }
        if (form.new_password.length < 8) {
            showToast.warning("La nueva contraseña debe tener al menos 8 caracteres")
            return
        }

        setIsSaving(true)
        try {
            await ChangePassword({
                old_password: form.old_password,
                new_password: form.new_password,
            } as any)
            showToast.success("Contraseña actualizada correctamente")
            setForm({ old_password: '', new_password: '' })
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

            {/* Último acceso y último cambio de contraseña */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                        <Clock size={16} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] text-gray-400 font-medium">Último acceso</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.last_access_date
                                ? new Date(user.last_access_date).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : '-'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                        <KeyRound size={16} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] text-gray-400 font-medium">Último cambio de contraseña</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.last_password_change
                                ? new Date(user.last_password_change).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : 'Sin cambios registrados'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordField label="Contraseña actual" id="old_password" value={form.old_password} onChange={handleChange('old_password')} />
                <PasswordField label="Nueva contraseña" id="new_password" value={form.new_password} onChange={handleChange('new_password')} />
            </div>

            <div className="flex justify-end mt-5">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="bg-primary_color text-white h-[40px] px-6 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all font-medium shadow-md text-sm disabled:opacity-60"
                >
                    <Save size={16} />
                    {isSaving ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
            </div>
        </div>
    )
}

export default SecuritySettings
