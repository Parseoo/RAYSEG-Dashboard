"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import { GetListRoles, GetRolePermissions, AssignPermissionsToRole, GetListPermissionsGrouped } from "@/lib/api/permission-api";
import AddPermissions from "../users-permissions/add-user/addPermissions";
import { UserForm } from "@/lib/@type";
import { Permission } from "@/lib/@type-permission";
import { Loader2, Save, ShieldCheck } from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import { InputField } from "@/components/ui/Input";

const PermissionsPage = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [allSystemPermissions, setAllSystemPermissions] = useState<Permission[]>([]);
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, any> | undefined>(undefined);
    const [dummyUser, setDummyUser] = useState<UserForm>({
        email: "",
        name: "",
        paternal_last_name: "",
        maternal_last_name: "",
        password: "",
        password_confirm: "",
        role: "",
        is_active: true,
        permissions: {}
    });

    useEffect(() => {
        const fetchRolesAndPermissions = async () => {
            try {
                setIsLoadingRoles(true);
                const [rolesRes, permsRes] = await Promise.all([
                    GetListRoles(),
                    GetListPermissionsGrouped()
                ]);
                
                const extractData = (res: any) => {
                    if (!res?.data) return [];
                    return res.data.items || res.data.catalogItems || (Array.isArray(res.data) ? res.data : (res.data.data && Array.isArray(res.data.data) ? res.data.data : []));
                };

                setRoles(extractData(rolesRes));
                const groupedData = permsRes.data || {};
                const allPermsFlat: Permission[] = [];
                Object.keys(groupedData).forEach(key => {
                    const group = groupedData[key];
                    const permissionsList = Array.isArray(group) ? group : (group.permissions || []);
                    permissionsList.forEach((p: any) => {
                        allPermsFlat.push({
                            id: p.id,
                            name: p.name,
                            codename: p.codename,
                            model: p.model || key,
                            is_system_role: false
                        });
                    });
                });
                setAllSystemPermissions(allPermsFlat);
                setGroupedPermissions(groupedData);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                showToast.error("Error al cargar datos iniciales");
            } finally {
                setIsLoadingRoles(false);
            }
        };
        fetchRolesAndPermissions();
    }, []);

    const handleRoleChange = async (roleId: string) => {
        setSelectedRoleId(roleId);
        if (!roleId) {
            setDummyUser(prev => ({ ...prev, permissions: {} }));
            return;
        }

        try {
            const res = await GetRolePermissions(roleId);
            const rawData: any = res.data;
            let perms = rawData.permissions || (rawData.data && rawData.data.permissions) || (Array.isArray(rawData) ? rawData : {});
            
            if (Array.isArray(perms)) {
                const uiPerms: Record<string, any> = {};
                perms.forEach((p: Permission) => {
                    const parts = p.codename.split('_');
                    const action = parts[0];
                    const model = parts.slice(1).join('_');

                    if (model && action) {
                        const sectionId = model === 'property' ? 'propiedades' :
                                        model === 'client' ? 'clientes' :
                                        model === 'agent' ? 'agentes' :
                                        model === 'contract' ? 'contratos' :
                                        model === 'user' ? 'ajustes-usuarios' :
                                        model === 'lead' ? 'leads-contacto' :
                                        model === 'propertyimage' ? 'imagenes-propiedades' : model;

                        uiPerms[sectionId] = true;
                        if (!uiPerms[`${sectionId}_actions`]) uiPerms[`${sectionId}_actions`] = [];

                        const actionId = action === 'view' ? 'ver-lista' :
                                        action === 'add' ? 'crear' :
                                        action === 'change' ? 'editar' :
                                        action === 'delete' ? 'eliminar' : action;

                        if (!uiPerms[`${sectionId}_actions`].includes(actionId)) {
                            uiPerms[`${sectionId}_actions`].push(actionId);
                        }
                    }
                });
                perms = uiPerms;
            }

            setDummyUser(prev => ({ ...prev, role: roleId, permissions: perms }));
        } catch (error) {
            console.error("Error fetching role permissions:", error);
            showToast.error("Error al cargar los permisos del rol");
        }
    };

    const handleSavePermissions = async () => {
        if (!selectedRoleId) {
            showToast.warning("Por favor selecciona un rol");
            return;
        }

        setIsSaving(true);
        try {
            const permissionIds: number[] = [];
            const uiPerms = dummyUser.permissions || {};

            Object.keys(uiPerms).forEach(key => {
                if (key.endsWith('_actions') && Array.isArray(uiPerms[key])) {
                    const sectionId = key.replace('_actions', '');
                    const actions = uiPerms[key] as string[];

                    const model = sectionId === 'propiedades' ? 'property' :
                                 sectionId === 'clientes' ? 'client' :
                                 sectionId === 'agentes' ? 'agent' :
                                 sectionId === 'contratos' ? 'contract' :
                                 sectionId === 'ajustes-usuarios' ? 'user' :
                                 sectionId === 'leads-contacto' ? 'lead' :
                                 sectionId === 'imagenes-propiedades' ? 'propertyimage' : sectionId;

                    actions.forEach(actionId => {
                        const verb = actionId === 'ver-lista' || actionId === 'ver-detalle' ? 'view' :
                                     actionId === 'crear' ? 'add' :
                                     actionId === 'editar' ? 'change' :
                                     actionId === 'eliminar' ? 'delete' : actionId;

                        const codename = `${verb}_${model}`;
                        const foundPerm = allSystemPermissions.find(p => p.codename === codename);
                        if (foundPerm) {
                            permissionIds.push(foundPerm.id);
                        }
                    });
                }
            });

            await AssignPermissionsToRole(selectedRoleId, { 
                permission_ids: permissionIds 
            });
            showToast.success("Permisos actualizados correctamente");
        } catch (error) {
            console.error("Error saving permissions:", error);
            showToast.error("Error al guardar los permisos");
        } finally {
            setIsSaving(false);
        }
    };

    const roleOptions = roles.map(role => ({
        label: role.name,
        value: String(role.id)
    }));

    return (
        <div className="space-y-6 pb-20">
            <Breadcrumb
                items={[
                    { label: "Inicio", href: "/" },
                    { label: "Configuración", href: "/settings/users-permissions" },
                    { label: "Permisos", href: "/settings/permissions", active: true },
                ]}
            />

            <div className='bg-white w-full rounded-lg p-6 sm:p-8 shadow-xl border border-slate-200'>
                <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className='font-extrabold text-2xl text-gray-900 mb-1'>Configuración de Permisos</h1>
                                <p className='text-sm text-gray-500 max-w-2xl'>Define qué secciones estarán visibles y qué acciones específicas puede realizar cada rol.</p>
                            </div>
                        </div>

                        <div className="flex items-end gap-3 w-full md:w-auto md:min-w-[300px]">
                            <InputField 
                                input={{
                                    type: 'select',
                                    id: 'role-select',
                                    label: 'Seleccionar Rol',
                                    placeholder: 'Elija un rol para configurar',
                                    value: selectedRoleId,
                                    onChange: (val: any) => handleRoleChange(val),
                                    options: roleOptions,
                                    className: "h-11"
                                }}
                                withBgWhite={true}
                            />
                            
                            <button 
                                onClick={handleSavePermissions}
                                disabled={!selectedRoleId || isSaving}
                                className="h-11 px-6 bg-primary_color text-white rounded-lg flex items-center gap-2 font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-md mb-[2px]"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Guardar
                            </button>
                        </div>
                    </div>

                    {selectedRoleId ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <AddPermissions
                                user={dummyUser}
                                setUser={setDummyUser as any}
                                isLoading={false}
                                withoutCard={true}
                                groupedPermissions={groupedPermissions}
                                isFetchingPermissions={isLoadingRoles}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
                                <ShieldCheck className="text-slate-200" size={40} />
                            </div>
                            <h3 className="text-slate-900 font-bold text-xl mb-2">Comienza la configuración</h3>
                            <p className="text-slate-400 text-sm max-w-sm text-center">Selecciona un rol del menú superior para visualizar y editar sus permisos por pantalla.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionsPage;
