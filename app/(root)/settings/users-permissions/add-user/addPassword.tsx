"use client"

import { useState } from 'react'
import { Eye, EyeOff, Lock, RefreshCw, Copy } from 'lucide-react'
import { UserForm } from '@/lib/@type'
import { showToast } from 'nextjs-toast-notify'
import { ResetPasswordUserByAdmin } from '@/lib/api/user-api'

interface AddPasswordProps {
    user: UserForm;
    setUser: React.Dispatch<React.SetStateAction<UserForm>>;
    errors: Partial<UserForm>;
    isEdit?: boolean;
    userId?: number;
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

export const AddPassword = ({ user, setUser, errors, isEdit = false, userId }: AddPasswordProps) => {
    const set = (field: keyof UserForm) => (val: string) => setUser(prev => ({ ...prev, [field]: val }))
    const [tempPassword, setTempPassword] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!userId) return;
        setIsGenerating(true);
        try {
            const response = await ResetPasswordUserByAdmin(userId, {} as any);
            const data = response.data as any;
            if (data.success) {
                setTempPassword(data.temporary_password);
                showToast.success(data.message || "Contraseña temporal generada");
            } else {
                showToast.error(data.message || "Error al generar la contraseña temporal");
            }
        } catch (error) {
            showToast.error("Error al generar la contraseña temporal");
        } finally {
            setIsGenerating(false);
        }
    }

    if (isEdit) {
        return (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 mt-4 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Seguridad y acceso</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Solo un administrador puede restablecer la contraseña de este usuario</p>
                    </div>
                </div>

                {!tempPassword ? (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Se generará una contraseña temporal que el usuario deberá cambiar en su próximo inicio de sesión.
                        </p>
                        <button 
                            type="button" 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 shadow-sm"
                        >
                            <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
                            {isGenerating ? "Generando..." : "Generar contraseña temporal"}
                        </button>
                    </div>
                ) : (
                    <div className="bg-green-50/50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-green-700 font-medium mb-3">Contraseña temporal generada</p>
                        
                        <div className="flex flex-row items-center gap-2 mb-3">
                            <div className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-gray-800 font-mono text-sm tracking-wider shadow-inner overflow-hidden text-ellipsis">
                                {tempPassword}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText(tempPassword);
                                    showToast.success("Copiado al portapapeles", { position: "top-right" });
                                }}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-slate-50 transition-colors flex-shrink-0 shadow-sm"
                                title="Copiar al portapapeles"
                            >
                                <Copy size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-500">El usuario deberá cambiarla en su próximo inicio de sesión.</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className='bg-white rounded-lg p-6 border shadow-sm mt-4'>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Lock size={20} />
                </div>
                <div>
                    <h2 className='text-lg font-bold text-gray-900'>Seguridad y Acceso</h2>
                    <p className='text-xs text-gray-500'>
                        Establece la contraseña de acceso para este usuario
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordField
                    id="password"
                    label="Contraseña"
                    value={user.password || ''}
                    onChange={set('password')}
                    error={errors.password as string}
                    required={true}
                />
                <PasswordField
                    id="password_confirm"
                    label="Confirmar contraseña"
                    value={user.password_confirm || ''}
                    onChange={set('password_confirm')}
                    error={errors.password_confirm as string}
                    required={true}
                />
            </div>
        </div>
    )
}

export default AddPassword
