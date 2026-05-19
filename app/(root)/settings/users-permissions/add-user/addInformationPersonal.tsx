"use client";

import { useState, useEffect } from "react"
import { DynamicInputs, InputFieldConfig } from "@/components/ui/Input"
import { ProfileImageUpload } from "@/components/ui/ProfileImageUpload"
import { UserForm } from "@/lib/@type"
import { GetCatalogByName } from "@/lib/api/catalog-api"
import { GetListRoles } from "@/lib/api/permission-api"
import { ItemResponse } from "@/lib/@type"

interface AddInformationPersonalProps {
    user: UserForm;
    setUser: React.Dispatch<React.SetStateAction<UserForm>>;
    errors: Partial<UserForm>;
    onImageChange?: (file: File) => void;
    rolesData?: any[];
}

export const AddInformationPersonal = ({ user, setUser, errors, onImageChange, rolesData = [] }: AddInformationPersonalProps) => {
    const [roleTypes, setRoleTypes] = useState<any[]>(rolesData);
    const [statusTypes, setStatusTypes] = useState<ItemResponse[]>([]);

    useEffect(() => {
        if (rolesData.length > 0) {
            setRoleTypes(rolesData);
        }
    }, [rolesData]);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const statusRes = await GetCatalogByName('user-status');

                const extractItems = (res: any): any[] => {
                    if (!res?.data) return [];
                    if (res.data.items) return res.data.items;
                    if (res.data.catalogItems) return res.data.catalogItems;
                    if (Array.isArray(res.data)) return res.data;
                    if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
                    return [];
                };

                setStatusTypes(extractItems(statusRes));
            } catch (error) {
                console.error("Error fetching user catalogs:", error);
            }
        };

        fetchCatalogs();
    }, []);

    const roleOptions = roleTypes.map(item => ({
        label: item.name,
        value: String(item.id || item.catalogItemID || item.name).toLowerCase()
    }));

    const statusOptions = statusTypes.map(item => ({
        label: item.name,
        value: (item.value || item.name).toLowerCase()
    }));

    const inputs: InputFieldConfig[] = [
        {
            type: 'text',
            id: 'name',
            label: 'Nombre(s)',
            placeholder: 'Nombre del agente',
            group: 1
        },
        {
            type: 'text',
            id: 'paternal_last_name',
            label: 'Apellido paterno',
            placeholder: 'Apellido paterno',
            group: 1
        },
        {
            type: 'text',
            id: 'maternal_last_name',
            label: 'Apellido materno',
            placeholder: 'Apellido materno',
            group: 1
        },
        {
            type: 'email',
            id: 'email',
            label: 'Correo electrónico',
            placeholder: 'agente@rayseg.com',
            group: 2
        },
        {
            type: 'tel',
            id: 'phone',
            label: 'Teléfono',
            placeholder: '+52 1 234 567 8900',
            group: 2
        },
        {
            type: 'select',
            id: 'role',
            label: 'Rol',
            placeholder: 'Seleccione un rol',
            group: 3,
            options: roleOptions
        },
        {
            type: 'select',
            id: 'is_active',
            label: 'Estatus',
            placeholder: 'Seleccione el estatus',
            group: 3,
            options: statusOptions
        },
        {
            type: 'textarea',
            id: 'notas_internas',
            label: 'Notas internas',
            placeholder: 'Información adicional sobre este usuario (zona de atención, tipo de propiedades, etc).',
            group: 4
        },
    ];

    const inputsWithState = inputs.map(input => ({
        ...input,
        value: user[input.id as keyof UserForm] as string | boolean,
        onChange: (e: any) => {
            const value = e.target ? e.target.value : e;

            let finalValue = value;
            if (input.id === 'is_active') {
                // Convertir a booleano solo si es explícitamente "true" o "false"
                // de lo contrario mantener como string para que coincida con la opción del catálogo
                if (value === 'true' || value === true) finalValue = true;
                else if (value === 'false' || value === false) finalValue = false;
                else finalValue = value;
                
                console.log(`[AddInformationPersonal] Cambiando is_active: original='${value}', final=${finalValue}`);
            }

            setUser(prev => ({ ...prev, [input.id]: finalValue }));
        },
        error: errors[input.id as keyof UserForm] as string | undefined
    }));

    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Información personal</h1>
                            <p className='text-md text-gray-500'>Identificación principal del cliente y tipo de relación.</p>

                            <div className='mt-6 mb-4'>
                                <ProfileImageUpload onImageChange={onImageChange ?? ((file) => console.log(file))} />
                            </div>

                            <div className='mt-4'>
                                <DynamicInputs inputs={inputsWithState} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}