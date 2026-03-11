"use client";

import React, { useState } from "react";
import { showToast } from "nextjs-toast-notify";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Save, X, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddInformationPersonal } from "./addInformationPersonal";
import AddPermissions from "./addPermissions";
import AddPassword from "./addPassword";
import { UserForm } from "@/lib/@type";
import { CreateUser } from "@/lib/api/user-api";

const initialUser: UserForm = {
    email: "",
    name: "",
    paternal_last_name: "",
    maternal_last_name: "",
    password: "",
    password_confirm: "",
    role: "",
    is_active: true,
};

interface AddUserProps {
    initialData?: UserForm | null;
    isEdit?: boolean;
    onSubmit?: (e: React.FormEvent, formData: UserForm) => Promise<void>;
}

const AddUser = ({ initialData, isEdit = false, onSubmit }: AddUserProps) => {
    const [user, setUser] = useState<UserForm>(initialData || initialUser);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingEvent, setPendingEvent] = useState<React.FormEvent | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            // En modo edición, mostrar modal de confirmación primero
            setPendingEvent(e);
            setShowConfirmModal(true);
        } else {
            handleSaveUser(e, user);
        }
    };

    const handleConfirmSave = async () => {
        if (!pendingEvent) return;
        setIsSaving(true);
        setShowConfirmModal(false);
        await handleSaveUser(pendingEvent, user);
        setIsSaving(false);
        setPendingEvent(null);
    };

    const handleSaveUser = async (e: React.FormEvent, formData: UserForm) => {
        e.preventDefault();
        
        if (onSubmit) {
            await onSubmit(e, formData);
            return;
        }

        try {
            const response = await CreateUser(user);
            
            showToast.success(response.data.message || "Usuario creado exitosamente", {
                duration: 5000,
                position: "top-right",
                transition: "topBounce",
                icon: "",
                sound: true,
            })
            
            router.push("/settings/users-permissions");
        } catch (error: any) {
            if (error.response) {
              showToast.error(error?.response?.data?.detail || error?.response?.data?.message || "Error al crear usuario");
            }
        }
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { label: "Inicio", href: "/" },
                    { label: "Configuración", href: "/settings" },
                    { label: "Usuarios y Permisos", href: "/settings/users-permissions" },
                    { label: isEdit ? "Editar Usuario" : "Agregar Usuario", href: isEdit ? "#" : "/settings/users-permissions/add-user", active: true },
                ]}
            />

            <div className="space-y-4">
                <form onSubmit={handleFormSubmit} className="bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md">
                    <div className="w-full h-full">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h1 className="font-[700] text-2xl">{isEdit ? "Editar usuario" : "Registrar nuevo usuario"}</h1>
                                <p className="text-md text-gray-500">
                                    {isEdit ? "Modifica los datos y permisos del usuario." : "Crea una cuenta para un nuevo integrante de tu inmobiliaria y define sus permisos pantalla por pantalla."}
                                </p>
                            </div>
                        </div>

                        <AddInformationPersonal user={user} setUser={setUser} errors={errors} />
                        <AddPermissions user={user} setUser={setUser} data={[]} isLoading={false} />
                        {!isEdit && <AddPassword user={user} setUser={setUser} errors={errors} />}

                        <div className="flex gap-4 justify-end mt-5">
                            <button type="button" onClick={() => router.push("/settings/users-permissions")}
                                className="bg-slate-100 w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium">
                                <X size={20} /> Cancelar
                            </button>

                            <button type="submit" disabled={isSaving}
                                className="bg-primary_color text-white w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium disabled:opacity-60">
                                <Save size={20} /> {isEdit ? "Guardar Cambios" : "Guardar Usuario"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Modal de confirmación para editar usuario */}
            {showConfirmModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                    onClick={() => setShowConfirmModal(false)}
                >
                    <div
                        className="bg-white rounded-[5px] shadow-2xl max-w-md w-full"
                        style={{ animation: 'scaleIn 0.2s ease-out' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">¿Guardar cambios?</h2>
                            </div>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <p className="text-gray-700 leading-relaxed">
                                ¿Estás seguro/a de que deseas guardar los cambios realizados a este usuario? Esta acción actualizará su información en el sistema.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-4 flex gap-3">
                            <button
                                onClick={handleConfirmSave}
                                className="flex-1 px-4 py-2 bg-primary_color text-white rounded-[5px] hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 text-sm"
                            >
                                <Save size={15} /> Sí, guardar cambios
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 text-gray-700 rounded-[5px] hover:bg-slate-200 transition-all font-medium text-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default AddUser;
