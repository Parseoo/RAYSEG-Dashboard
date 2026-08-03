"use client";

import React, { useState, useEffect } from "react";
import { showToast } from "nextjs-toast-notify";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Save, X, AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddInformationPersonal } from "./addInformationPersonal";
import AddPassword from "./addPassword";
import { UserForm } from "@/lib/@type";
import { CreateUser, UploadProfilePicture } from "@/lib/api/user-api";
import { GetListRoles, GetRolePermissions } from "@/lib/api/permission-api";

// Función para formatear mensajes de error de Pydantic a español
const formatErrorMessage = (msg: string, type?: string): string => {
    const msgLower = msg.toLowerCase();

    if (msgLower.includes('field required') || msgLower.includes('missing')) {
        return 'Campo requerido';
    }
    if (msgLower.includes('email')) {
        return 'Correo electrónico inválido';
    }
    if (msgLower.includes('string too short') || msgLower.includes('ensure this value has at least')) {
        return 'El texto es muy corto';
    }
    if (msgLower.includes('string too long') || msgLower.includes('ensure this value has at most')) {
        return 'El texto es muy largo';
    }
    if (msgLower.includes('value error')) {
        const match = msg.match(/Value error, \['(.*?)'\]/i);
        if (match && match[1]) {
            return match[1];
        }
        return msg.replace(/Value error, /i, '').replace(/[\[\]']/g, '');
    }
    if (msgLower.includes('type_error')) {
        return 'Tipo de dato incorrecto';
    }

    // Limpiar el mensaje para mostrarlo de forma legible
    return msg.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const initialUser: UserForm = {
    email: "",
    name: "",
    paternal_last_name: "",
    maternal_last_name: "",
    password: "",
    password_confirm: "",
    role: "",
    is_active: "true",
};

interface AddUserProps {
    initialData?: UserForm | null;
    isEdit?: boolean;
    userId?: number;
    onSubmit?: (e: React.FormEvent, formData: UserForm) => Promise<number | null>;
    onAfterSave?: () => void;
}

const AddUser = ({ initialData, isEdit = false, onSubmit, userId, onAfterSave }: AddUserProps) => {
    const [user, setUser] = useState<UserForm>(initialData || initialUser);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [roles, setRoles] = useState<any[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingEvent, setPendingEvent] = useState<React.FormEvent | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoadingRoles(true);
                const res = await GetListRoles();
                if (res.data) {
                    const extracted = res.data.items || res.data.catalogItems || (Array.isArray(res.data) ? res.data : (res.data.data && Array.isArray(res.data.data) ? res.data.data : []));
                    setRoles(extracted);
                }
            } catch (error) {
                console.error("Error fetching roles in AddUser:", error);
            } finally {
                setIsLoadingRoles(false);
            }
        };
        fetchRoles();
    }, []);

    const validateUserFields = (): boolean => {
        const tempErrors: Record<string, string> = {};
        if (!user.name?.trim()) {
            tempErrors.name = "El campo es requerido";
        }
        if (!user.paternal_last_name?.trim()) {
            tempErrors.paternal_last_name = "El campo es requerido";
        }
        if (!user.email?.trim()) {
            tempErrors.email = "El campo es requerido";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user.email)) {
                tempErrors.email = "Por favor ingrese un correo electrónico válido";
            }
        }
        if (!user.role) {
            tempErrors.role = "El campo es requerido";
        }

        if (!isEdit) {
            if (!user.password) {
                tempErrors.password = "El campo es requerido";
            } else if (user.password.length < 8) {
                tempErrors.password = "La contraseña debe tener al menos 8 caracteres";
            }
            if (!user.password_confirm) {
                tempErrors.password_confirm = "El campo es requerido";
            } else if (user.password !== user.password_confirm) {
                tempErrors.password_confirm = "Las contraseñas no coinciden";
            }
        } else {
            // Si está en modo edición y el usuario ingresó contraseña, validarla
            if (user.password || user.password_confirm) {
                if (user.password && user.password.length < 8) {
                    tempErrors.password = "La contraseña debe tener al menos 8 caracteres";
                }
                if (user.password !== user.password_confirm) {
                    tempErrors.password_confirm = "Las contraseñas no coinciden";
                }
            }
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            showToast.warning("Por favor, complete los campos requeridos marcados en rojo.");
            return false;
        }

        setErrors({});
        return true;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateUserFields()) return;
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
        if (!validateUserFields()) return;

        const fileToBase64 = (file: File): Promise<string> =>
            new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

        if (onSubmit) {
            const editedUserId = await onSubmit(e, formData);
            if (editedUserId) {
                if (profileImage) {
                    try {
                        const base64 = await fileToBase64(profileImage);
                        await UploadProfilePicture(editedUserId, base64);
                    } catch (imgError) {
                        console.error("Error al subir la foto de perfil:", imgError);
                        showToast.warning("Usuario guardado, pero hubo un detalle al subir la foto de perfil.", {
                            duration: 4000, position: "top-right", transition: "topBounce", icon: "", sound: false,
                        });
                    }
                }
                onAfterSave?.();
            }
            return;
        }

        // Convertir imagen a base64 si fue seleccionada
        let profilePictureBase64: string | undefined = undefined;
        if (profileImage) {
            try {
                profilePictureBase64 = await fileToBase64(profileImage);
            } catch (err) {
                console.error("Error al convertir imagen:", err);
            }
        }

        // Construir el address según lo esperado por el backend
        const address = {
            state: user.estado || "",
            city: user.ciudad || "",
            neighborhood: user.colonia || "",
            postal_code: user.codigo_postal || "",
            full_address: [user.colonia, user.ciudad, user.estado, user.codigo_postal].filter(Boolean).join(", ")
        };

        // Construir los datos finales según el esquema exacto del backend
        const finalUserData = {
            email: user.email,
            name: user.name,
            paternal_last_name: user.paternal_last_name,
            maternal_last_name: user.maternal_last_name || "",
            phone: user.phone || "",
            address: address,
            profile_picture: profilePictureBase64,
            internal_notes: user.notas_internas || user.internal_notes || "",
            password: user.password,
            password_confirm: user.password_confirm,
            role: user.role,
            role_id: user.role ? Number(user.role) : 0,
            is_active: user.is_active === 'true' || user.is_active === true || user.is_active === 'activo',
            is_staff: true,
            is_superuser: false,
        };

        try {
            setIsSaving(true);

            const response = await CreateUser(finalUserData);

            const newUserId = response.data?.data
                ? parseInt(response.data.data)
                : (response.data as any)?.id;

            // Subir foto por endpoint dedicado si no se guardó en el create
            if (profileImage && newUserId && !isNaN(newUserId) && profilePictureBase64) {
                try {
                    await UploadProfilePicture(newUserId, profilePictureBase64);
                } catch (imgError) {
                    console.error("Error en UploadProfilePicture:", imgError);
                }
            }

            showToast.success(response.data.message || "Usuario creado exitosamente", {
                duration: 5000,
                position: "top-right",
                transition: "topBounce",
                icon: "",
                sound: true,
            })

            router.push("/settings/users-permissions");
        } catch (error: any) {
            console.error("Error completo al crear usuario:", error);

            if (error.response) {
                const errorData = error.response.data;

                // Manejar errores de validación 422 de FastAPI/Pydantic
                if (error.response.status === 422 && errorData.detail) {
                    const serverErrors: Record<string, string> = {};

                    if (Array.isArray(errorData.detail)) {
                        // FastAPI validation error array - mapear errores a campos
                        const fieldMapping: Record<string, string> = {
                            'email': 'email',
                            'name': 'name',
                            'paternal_last_name': 'paternal_last_name',
                            'maternal_last_name': 'maternal_last_name',
                            'password': 'password',
                            'password_confirm': 'password_confirm',
                            'role_id': 'role',
                            'is_active': 'is_active',
                            'is_staff': 'is_staff',
                            'is_superuser': 'is_superuser',
                            'phone': 'phone',
                            'address': 'address',
                            'internal_notes': 'notas_internas'
                        };

                        errorData.detail.forEach((err: any) => {
                            const field = err.loc ? err.loc[err.loc.length - 1] : 'general';
                            const mappedField = fieldMapping[field] || field;
                            const message = formatErrorMessage(err.msg, err.type);

                            if (serverErrors[mappedField]) {
                                serverErrors[mappedField] += `, ${message}`;
                            } else {
                                serverErrors[mappedField] = message;
                            }
                        });

                        // Mostrar errores en los campos correspondientes
                        if (Object.keys(serverErrors).length > 0) {
                            setErrors(serverErrors);
                        }

                        // Toast general con todos los errores
                        const errorSummary = Object.values(serverErrors).join('\n');
                        showToast.error(errorSummary || "Error de validación en los datos ingresados", {
                            duration: 6000,
                            position: "top-right",
                            transition: "topBounce",
                        });
                    } else if (typeof errorData.detail === 'string') {
                        const message = formatErrorMessage(errorData.detail);
                        if (errorData.detail.toLowerCase().includes('email')) {
                            setErrors(prev => ({ ...prev, email: message }));
                        }
                        showToast.error(message);
                    } else {
                        showToast.error("Error de validación en los datos ingresados");
                    }
                } else {
                    const errorMsg = errorData?.message || errorData?.detail || "Error al crear usuario";
                    if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('email')) {
                        setErrors(prev => ({ ...prev, email: errorMsg }));
                    }
                    showToast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
                }
            } else {
                showToast.error("Error de conexión al servidor");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { label: "Inicio", href: "/" },
                    { label: "Configuración", href: "/settings" },
                    { label: "Usuarios", href: "/settings/users-permissions" },
                    { label: isEdit ? "Editar Usuario" : "Agregar Usuario", href: isEdit ? "#" : "/settings/users-permissions/add-user", active: true },
                ]}
            />

            <div className="mb-3">
                <button onClick={() => router.push('/settings/users-permissions')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={18} /><span className="text-sm">Volver</span>
                </button>
            </div>

            <div className="space-y-4">
                <form noValidate onSubmit={handleFormSubmit} className="bg-white w-full max-h-max rounded-lg p-5 mb-9 shadow-md">
                    <div className="w-full h-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-4">
                            <div>
                                <h1 className="font-[700] text-2xl">{isEdit ? "Editar usuario" : "Agregar usuario"}</h1>
                                <p className="text-md text-gray-500">
                                    {isEdit ? "Modifica los datos y permisos del usuario." : "Crea una cuenta para un nuevo integrante de tu inmobiliaria y define sus permisos pantalla por pantalla."}
                                </p>
                            </div>
                        </div>

                        <AddInformationPersonal user={user} setUser={setUser} errors={errors} onImageChange={setProfileImage} rolesData={roles} />
                        <AddPassword user={user} setUser={setUser} errors={errors} />

                        <div className="flex gap-4 justify-end mt-5">
                            <button type="button" onClick={() => router.push("/settings/users-permissions")}
                                className="bg-slate-100 w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-200 transition-all font-medium shadow-md">
                                <X size={20} /> Cancelar
                            </button>

                            <button type="submit" disabled={isSaving}
                                className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md disabled:opacity-60">
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
                                className="flex-1 px-4 py-2 bg-primary_color text-white rounded-[5px] hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 text-sm shadow-md"
                            >
                                <Save size={15} /> Sí, guardar cambios
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 text-gray-700 rounded-[5px] hover:bg-slate-200 transition-all font-medium text-sm shadow-md"
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
