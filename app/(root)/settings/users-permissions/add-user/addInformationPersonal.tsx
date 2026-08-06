"use client";

import { useState, useEffect } from "react"
import { DynamicInputs, InputFieldConfig } from "@/components/ui/Input"
import { ProfileImageUpload } from "@/components/ui/ProfileImageUpload"
import { UserForm } from "@/lib/@type"
import { GetCatalogByName } from "@/lib/api/catalog-api"
import { GetEstados, GetCiudades } from '@/lib/api/property/property-api'
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
    const [estadosOptions, setEstadosOptions] = useState<any[]>([]);
    const [ciudadesOptions, setCiudadesOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        if (rolesData.length > 0) {
            setRoleTypes(rolesData);
        }
    }, [rolesData]);

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const res = await GetEstados();
                const raw: any = res?.data || res;
                let arr: any[] = [];
                if (Array.isArray(raw)) arr = raw;
                else if (raw?.data && Array.isArray(raw.data)) arr = raw.data;

                if (arr.length > 0) {
                    const mapped = arr.map((e: any) => ({
                        label: e.estado || e.nombre || e.name || String(e),
                        value: e.estado || e.nombre || e.name || String(e),
                        code: e.codigo_estado || e.clave || e.id || String(e)
                    }));
                    setEstadosOptions(mapped);
                }
            } catch (err) {
                console.error('Error fetching estados for users form:', err);
            }
        };
        fetchEstados();
    }, []);

    useEffect(() => {
        const fetchCiudades = async () => {
            const currentEstado = user.estado;
            if (!currentEstado) {
                setCiudadesOptions([]);
                return;
            }
            try {
                let stateCode = currentEstado;
                const matched = estadosOptions.find(e => e.value.toLowerCase() === currentEstado.toLowerCase());
                if (matched) {
                    stateCode = matched.code;
                }
                const response = await GetCiudades(stateCode);
                const raw: any = response?.data || response;
                let ciudadesData: any[] = [];
                if (Array.isArray(raw)) ciudadesData = raw;
                else if (raw?.data && Array.isArray(raw.data)) ciudadesData = raw.data;

                if (ciudadesData.length > 0) {
                    setCiudadesOptions(ciudadesData.map((item: any) => ({
                        label: item.ciudad || item.nombre || String(item),
                        value: item.ciudad || item.nombre || String(item)
                    })));
                } else {
                    setCiudadesOptions([]);
                }
            } catch (err) {
                console.error('Error fetching ciudades for user form:', err);
                setCiudadesOptions([]);
            }
        };
        if (estadosOptions.length > 0) {
            fetchCiudades();
        }
    }, [user.estado, estadosOptions]);

    const roleOptions = roleTypes.map(item => ({
        label: item.name,
        value: item.id || item.catalogItemID  // Usar el ID numérico directamente
    }));

    const inputs: InputFieldConfig[] = [
        {
            type: 'text',
            id: 'name',
            label: 'Nombre(s)',
            placeholder: 'Nombre',
            group: 1,
            required: true
        },
        {
            type: 'text',
            id: 'paternal_last_name',
            label: 'Apellido paterno',
            placeholder: 'Apellido paterno',
            group: 1,
            required: true
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
            group: 2,
            required: true
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
            id: 'estado',
            label: 'Estado',
            placeholder: 'Seleccione un estado',
            group: 5,
            options: [], // se poblará dinámicamente
            required: true
        },
        {
            type: 'select',
            id: 'ciudad',
            label: 'Ciudad',
            placeholder: 'Seleccione una ciudad',
            group: 5,
            options: ciudadesOptions,
            required: true
        },
        {
            type: 'text',
            id: 'street',
            label: 'Calle',
            placeholder: 'Calle / Calle principal',
            group: 6
        },
        {
            type: 'text',
            id: 'ext_number',
            label: 'Número exterior',
            placeholder: 'No. Ext',
            group: 6
        },
        {
            type: 'text',
            id: 'int_number',
            label: 'Número interior',
            placeholder: 'No. Int',
            group: 6
        },
        {
            type: 'text',
            id: 'colonia',
            label: 'Colonia',
            placeholder: 'Colonia',
            group: 7
        },
        {
            type: 'number',
            id: 'codigo_postal',
            label: 'Código postal',
            placeholder: 'Código postal',
            group: 7
        },
        {
            type: 'select',
            id: 'role',
            label: 'Rol',
            placeholder: 'Seleccione un rol',
            group: 3,
            options: roleOptions,
            required: true
        },
        {
            type: 'switch',
            id: 'is_active',
            label: 'Estatus del usuario',
            group: 3
        },
        {
            type: 'switch',
            id: 'is_superuser',
            label: 'Acceso de Superadministrador',
            group: 3
        },
        {
            type: 'textarea',
            id: 'notas_internas',
            label: 'Notas internas',
            placeholder: 'Información adicional sobre este usuario (zona de atención, tipo de propiedades, etc).',
            group: 4
        }
    ];

    const inputsWithState = inputs.map(input => ({
        ...input,
        options: input.id === 'estado' ? estadosOptions : (input.id === 'ciudad' ? ciudadesOptions : (input as any).options),
        value: user[input.id as keyof UserForm] as string | boolean,
        onChange: (e: any) => {
            const value = e.target ? e.target.value : e;
            setUser(prev => {
                const updated = { ...prev, [input.id]: value };
                if (input.id === 'estado') {
                    updated.ciudad = ''; // Limpiar ciudad al cambiar estado
                }
                return updated;
            });
        },
        error: errors[input.id as keyof UserForm] as string | undefined
    }));

    return (
        <div className='w-full max-h-max rounded-xl p-4 sm:p-6 mb-5 border border-slate-200 bg-white shadow-sm'>
            <h2 className='font-semibold text-lg text-gray-900'>Información personal</h2>
            <p className='text-sm text-gray-500 mt-0.5'>Datos de identificación del usuario y su rol en la plataforma.</p>

            <div className='mt-5 mb-6'>
                <ProfileImageUpload 
                    currentImage={user.profile_picture}
                    onImageChange={onImageChange ?? ((file) => console.log(file))} 
                />
            </div>

            <div className='mt-4'>
                <DynamicInputs inputs={inputsWithState} withBgWhite={true} />
            </div>
        </div>
    )
}