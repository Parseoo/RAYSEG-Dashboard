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
                // Map UserResponse to UserForm
                const mappedData: UserForm = {
                    email: response.data.email,
                    name: response.data.name,
                    paternal_last_name: response.data.paternal_last_name,
                    maternal_last_name: response.data.maternal_last_name || "",
                    password: "", // Password is usually not returned or handled separately
                    password_confirm: "",
                    role: response.data.role || "",
                    is_active: response.data.is_active,
                    permissions: (response.data as any).permissions || {}
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

    const handleEditUser = async (e: React.FormEvent, formData: UserForm) => {
        e.preventDefault();
        try {
            const response = await EditUser(Number(userId), formData);
            showToast.success(response.data.message || "Usuario actualizado exitosamente");
            router.push("/settings/users-permissions");
        } catch (error: any) {
            console.error("Error updating user:", error);
            showToast.error(error?.response?.data?.detail || "Error al actualizar usuario");
        }
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
            onSubmit={handleEditUser} 
        />
    );
};

export default EditUserPage;
