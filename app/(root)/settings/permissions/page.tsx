"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import { GetListRoles, GetRolePermissions, AssignPermissionsToRole, GetListPermissionsByModule, GetUserPermissionCurrent } from "@/lib/api/permission-api";
import AddPermissions from "../users-permissions/add-user/addPermissions";
import { UserForm } from "@/lib/@type";
import { useUserStore } from "@/lib/store/userStore";
import { Permission } from "@/lib/@type-permission";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, ShieldCheck, Lock, X, Plus } from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import { InputField } from "@/components/ui/Input";

const PermissionsPage = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [allSystemPermissions, setAllSystemPermissions] = useState<Permission[]>([]);
    const [codenameToModule, setCodenameToModule] = useState<Record<string, string>>({});
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, any> | undefined>(undefined);
    const [dummyUser, setDummyUser] = useState<UserForm>({
        email: "",
        name: "",
        paternal_last_name: "",
        maternal_last_name: "",
        password: "",
        old_password: "",
        role: "",
        is_active: true,
        permissions: {}
    });

    const { user } = useUserStore();

    useEffect(() => {
        const fetchRolesAndPermissions = async () => {
            try {
                setIsLoadingRoles(true);
                const [rolesRes, permsRes] = await Promise.all([
                    GetListRoles(),
                    GetListPermissionsByModule()
                ]);

                const extractData = (res: any) => {
                    if (!res?.data) return [];
                    if (res.data.items) return res.data.items;
                    if (res.data.catalogItems) return res.data.catalogItems;
                    if (Array.isArray(res.data)) return res.data;
                    if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
                    return [];
                };

                setRoles(extractData(rolesRes));
                const groupedData = permsRes.data || {};
                
                const moduleMapping: Record<string, string> = {};
                const allPermsFlat: Permission[] = [];
                
                Object.keys(groupedData).forEach(moduleName => {
                    const group = groupedData[moduleName];
                    const permissionsList = Array.isArray(group) ? group : (group.permissions || []);
                    permissionsList.forEach((p: any) => {
                        moduleMapping[p.codename] = moduleName;
                        allPermsFlat.push({
                            id: p.id,
                            name: p.name,
                            codename: p.codename,
                            model: p.model || moduleName,
                            is_system_role: false
                        });
                    });
                });
                
                setAllSystemPermissions(allPermsFlat);
                setCodenameToModule(moduleMapping);
                setGroupedPermissions(groupedData);

                // Cargar permisos del usuario actual si existen
                try {
                    const currentPermsRes = await GetUserPermissionCurrent();
                    const rawData: any = currentPermsRes.data;
                    let perms = rawData.permissions || (rawData.data?.permissions) || (Array.isArray(rawData) ? rawData : {});
                    
                    if (Array.isArray(perms) && perms.length > 0) {
                        const uiPerms: Record<string, any> = {};
                        perms.forEach((p: Permission) => {
                            const sectionId = moduleMapping[p.codename]; 
                            if (sectionId) {
                                uiPerms[sectionId] = true;
                                if (!uiPerms[`${sectionId}_actions`]) uiPerms[`${sectionId}_actions`] = [];
                                const actionId = String(p.id);
                                if (!uiPerms[`${sectionId}_actions`].includes(actionId)) {
                                    uiPerms[`${sectionId}_actions`].push(actionId);
                                }
                            }
                        });
                        
                        const currentUserRoleId = typeof user?.role === 'object' ? String((user?.role as any)?.id) : String(user?.role || "");
                        
                        setDummyUser(prev => ({ ...prev, role: "current_user", permissions: uiPerms }));
                        setSelectedRoleId("current_user");
                    }
                } catch (e) {
                    console.error("Error fetching current user permissions", e);
                }

            } catch (error) {
                console.error("Error fetching initial data:", error);
                showToast.error("Error al cargar datos iniciales");
            } finally {
                setIsLoadingRoles(false);
            }
        };
        fetchRolesAndPermissions();
    }, [user]);

    const handleRoleChange = async (roleId: string) => {
        setSelectedRoleId(roleId);
        if (!roleId) {
            setDummyUser(prev => ({ ...prev, permissions: {} }));
            return;
        }

        try {
            const res = await GetRolePermissions(roleId);
            const rawData: any = res.data;
            let perms = rawData.permissions || (rawData.data?.permissions) || (Array.isArray(rawData) ? rawData : {});

            if (Array.isArray(perms)) {
                const uiPerms: Record<string, any> = {};
                perms.forEach((p: Permission) => {
                    const sectionId = codenameToModule[p.codename]; // Resolve module dynamically

                    if (sectionId) {
                        uiPerms[sectionId] = true;
                        if (!uiPerms[`${sectionId}_actions`]) uiPerms[`${sectionId}_actions`] = [];

                        const actionId = String(p.id);

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
                    const actions = uiPerms[key] as string[];
                    actions.forEach(actionId => {
                        permissionIds.push(Number(actionId));
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

    const fetchCurrentUserPermissions = async () => {
        try {
            const currentPermsRes = await GetUserPermissionCurrent();
            const rawData: any = currentPermsRes.data;
            let perms = rawData.permissions || (rawData.data?.permissions) || (Array.isArray(rawData) ? rawData : {});
            
            if (Array.isArray(perms) && perms.length > 0) {
                const uiPerms: Record<string, any> = {};
                perms.forEach((p: Permission) => {
                    const sectionId = codenameToModule[p.codename]; 
                    if (sectionId) {
                        uiPerms[sectionId] = true;
                        if (!uiPerms[`${sectionId}_actions`]) uiPerms[`${sectionId}_actions`] = [];
                        const actionId = String(p.id);
                        if (!uiPerms[`${sectionId}_actions`].includes(actionId)) {
                            uiPerms[`${sectionId}_actions`].push(actionId);
                        }
                    }
                });
                setDummyUser(prev => ({ ...prev, role: "current_user", permissions: uiPerms }));
            }
        } catch (e) {
            console.error("Error fetching current user permissions", e);
        }
    };

    const handleTabChange = async (tab: "current_user" | "role") => {
        if (tab === "current_user") {
            setSelectedRoleId("current_user");
            await fetchCurrentUserPermissions();
        } else {
            setSelectedRoleId("");
            setDummyUser(prev => ({ ...prev, permissions: {} }));
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <Breadcrumb
                items={[
                    { label: "Inicio", href: "/" },
                    { label: "Configuración", href: "/settings/users-permissions" },
                    { label: "Permisos", href: "/settings/permissions", active: true },
                ]}
            />

            <Card className='w-full'>
                <CardContent className="p-6 sm:p-8">
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 border-b border-slate-100 pb-6">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h1 className='font-extrabold text-2xl text-gray-900 mb-1'>Configuración de Permisos</h1>
                                    <p className='text-sm text-gray-500 max-w-2xl'>Define qué secciones estarán visibles y qué acciones específicas puede realizar cada rol.</p>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange("current_user")}
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${selectedRoleId === "current_user" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Mis permisos
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange("role")}
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${selectedRoleId !== "current_user" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        Permisos por rol
                                    </button>
                                </div>
                            </div>

                            {selectedRoleId !== "current_user" && (
                                <div className="flex items-end gap-3 w-full md:w-auto">
                                    <div className="flex flex-col md:flex-row md:items-end gap-3 w-full">
                                        <InputField
                                            input={{
                                                type: 'select',
                                                id: 'role-select',
                                                label: 'Seleccionar Rol',
                                                placeholder: 'Elija un rol para configurar',
                                                value: selectedRoleId,
                                                onChange: (val: any) => handleRoleChange(val),
                                                options: roleOptions,
                                                className: "h-11 min-w-[250px]"
                                            }}
                                            withBgWhite={true}
                                        />
                                    </div>

                                    <button type="button"
                                        onClick={handleSavePermissions}
                                        disabled={!selectedRoleId || isSaving}
                                        className="h-11 px-6 bg-primary_color text-white rounded-lg flex items-center gap-2 font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-md mb-[2px] shrink-0"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Guardar
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-8 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="font-semibold text-slate-800">Cómo leer los tags:</span>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm cursor-default">
                                    Ejemplo
                                    <div className="flex items-center justify-center rounded-full bg-black/5 p-0.5">
                                        <X size={10} strokeWidth={3} />
                                    </div>
                                </span>
                                <span>= otorgado, clic en <X size={12} className="inline mx-0.5" strokeWidth={3} /> para quitar</span>
                            </div>
                            <div className="hidden sm:block text-slate-300 mx-2">|</div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-dashed bg-transparent text-slate-500 border-slate-400 cursor-default">
                                    Ejemplo
                                    <div className="flex items-center justify-center rounded-full p-0.5">
                                        <Plus size={12} strokeWidth={2.5} />
                                    </div>
                                </span>
                                <span>= disponible, clic en <Plus size={12} className="inline mx-0.5" strokeWidth={3} /> para otorgar</span>
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
                </CardContent>
            </Card>
        </div>
    );
};

export default PermissionsPage;
