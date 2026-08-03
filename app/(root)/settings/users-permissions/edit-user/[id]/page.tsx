"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { Loader2 } from "lucide-react";
import AddUser from "../../add-user/addUser";
import { GetUsersById, EditUser } from "@/lib/api/user-api";
import { UserForm } from "@/lib/@type";

const EditUserPage = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;
    const [userData, setUserData] = useState<UserForm | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await GetUsersById(Number(userId));
                // Map UserResponse to UserForm (transform API structure to form structure)
                const apiData = response.data;
                const mappedData: UserForm = {
                    email: apiData.email,
                    name: apiData.name,
                    paternal_last_name: apiData.paternal_last_name,
                    maternal_last_name: apiData.maternal_last_name || "",
                    password: "",
                    password_confirm: "",
                    // role: si es objeto {id, name} usar el id, si es string usar directo
                    role: typeof apiData.role === 'object' && apiData.role !== null
                        ? String((apiData.role as any).id)
                        : (apiData.role || ""),
                    // is_active como string para el formulario
                    is_active: apiData.is_active ? "true" : "false",
                    phone: apiData.phone || "",
                    // Mapear address del API a campos separados del formulario
                    estado: apiData.address?.state || "",
                    ciudad: apiData.address?.city || "",
                    colonia: apiData.address?.neighborhood || "",
                    codigo_postal: apiData.address?.postal_code || "",
                    // Notas internas
                    notas_internas: apiData.internal_notes || "",
                    internal_notes: apiData.internal_notes || "",
                    profile_picture: apiData.profile_picture || "",
                };
                setUserData(mappedData);
            } catch (error) {
                console.error("Error fetching user for edit:", error);
                showToast.error("No se pudo cargar la información del usuario");
                router.push("/settings/users-permissions");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, router]);

    const handleEditUser = async (e: React.FormEvent, formData: UserForm): Promise<number | null> => {
        e.preventDefault();
        try {
            // Transformar datos del formulario al formato que espera el API
            const address = {
                state: formData.estado || "",
                city: formData.ciudad || "",
                neighborhood: formData.colonia || "",
                street: "",
                postal_code: formData.codigo_postal || ""
            };

            const apiData: any = {
                email: formData.email,
                name: formData.name,
                paternal_last_name: formData.paternal_last_name,
                maternal_last_name: formData.maternal_last_name || null,
                phone: formData.phone || undefined,
                role_id: formData.role ? Number(formData.role) : null,
                is_active: formData.is_active === 'true' || formData.is_active === true || formData.is_active === 'activo',
                is_staff: false,
                is_superuser: false,
                address: address,
                internal_notes: formData.notas_internas || undefined,
            };

            if (formData.password) {
                apiData.password = formData.password;
                apiData.password_confirm = formData.password_confirm;
            }

            const response = await EditUser(Number(userId), apiData);
            showToast.success(response.data.message || "Usuario actualizado exitosamente");
            return Number(userId);
        } catch (error: any) {
            console.error("Error updating user:", error);
            // Asegurar que el mensaje sea string (puede ser objeto si el backend retorna detail como JSON)
            const rawDetail = error?.response?.data?.detail || error?.response?.data?.message || error?.response?.data?.error;
            const errorMessage = typeof rawDetail === 'string' ? rawDetail : JSON.stringify(rawDetail);

            if (error?.response?.status === 401) {
                showToast.error("Tu sesión ha expirado. Serás redirigido al login.");
                router.push("/sign-in?session_expired=true");
            } else {
                showToast.error(errorMessage || "Error al actualizar usuario");
            }
            return null;
        }
    };

    const handleAfterSave = () => {
        router.push("/settings/users-permissions");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-primary_color animate-spin" />
                <p className="text-gray-500 font-medium">Cargando información para editar...</p>
            </div>
        );
    }

    return (
        <AddUser 
            initialData={userData} 
            isEdit={true} 
            userId={Number(userId)}
            onSubmit={handleEditUser}
            onAfterSave={handleAfterSave}
        />
    );
};

export default EditUserPage;
