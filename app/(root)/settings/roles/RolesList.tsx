"use client"

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Loader2, MoreVertical } from 'lucide-react';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Table } from '@/components/ui/table';
import DeleteModal from '@/components/ui/DeleteModal';
import Tooltip from '@/components/ui/Tooltip';
import { GetListRoles, DeleteRoleById, CreateRole, UpdateRoleById } from '@/lib/api/permission-api';
import { showToast } from 'nextjs-toast-notify';
import { InputField } from '@/components/ui/Input';
import { Save } from 'lucide-react';

const headers = ['ID', 'Nombre del Rol', 'Descripción', 'Sistema', 'Creado El', 'Actualizado El', 'Acciones'];

function RolesList() {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: any | null }>({ isOpen: false, item: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', description: '' });
    const [editingRole, setEditingRole] = useState<any | null>(null);
    const [openActionMenu, setOpenActionMenu] = useState<string | number | null>(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const { data } = await GetListRoles();
            // El API parece devolver los roles en data.items o data directamente
            const rolesData = data.items || data.catalogItems || (Array.isArray(data) ? data : []);
            setRoles(rolesData);
        } catch (error: any) {
            console.error("Error fetching roles:", error);
            showToast.error("Error al cargar los roles");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (role: any) => {
        if (role.is_system_role) {
            showToast.warning("Los roles de sistema no pueden eliminarse");
            return;
        }
        setDeleteModal({ isOpen: true, item: role });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.item) return;
        setIsDeleting(true);
        try {
            await DeleteRoleById(deleteModal.item.id);
            setRoles(prev => prev.filter(r => r.id !== deleteModal.item.id));
            setDeleteModal({ isOpen: false, item: null });
            showToast.success("Rol eliminado correctamente");
        } catch (error: any) {
            showToast.error("Error al eliminar el rol");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRole.name.trim()) {
            showToast.warning("Por favor ingrese el nombre del rol");
            return;
        }

        setIsCreating(true);
        try {
            if (editingRole) {
                await UpdateRoleById(editingRole.id, newRole);
                showToast.success("Rol actualizado correctamente");
            } else {
                await CreateRole(newRole);
                showToast.success("Rol creado correctamente");
            }
            setIsCreateModalOpen(false);
            setNewRole({ name: '', description: '' });
            setEditingRole(null);
            fetchRoles();
        } catch (error: any) {
            showToast.error(editingRole ? "Error al actualizar el rol" : "Error al crear el rol");
        } finally {
            setIsCreating(false);
        }
    };

    const toggleActionMenu = (id: string | number) => {
        setOpenActionMenu(prev => prev === id ? null : id);
    };

    const renderRow = (role: any) => {
        return (
            <tr key={role.id} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
                <td className='py-4 px-4 text-xs font-mono text-slate-400'>
                    {role.id}
                </td>
                <td className='py-4 px-4'>
                    <div className='flex items-center gap-3'>
                        <p className='font-bold text-sm text-slate-800'>{role.name}</p>
                    </div>
                </td>
                <td className='py-4 px-4 text-sm text-gray-500 max-w-md truncate'>
                    {role.description || <span className='italic text-slate-300'>Sin descripción</span>}
                </td>
                <td className='py-4 px-4'>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${role.is_system_role ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {role.is_system_role ? 'Sí' : 'No'}
                    </span>
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>
                    {role.created_at ? new Date(role.created_at).toLocaleString('es-MX', { timeZone: 'UTC' }) : "-"}
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>
                    {role.updated_at ? new Date(role.updated_at).toLocaleString('es-MX', { timeZone: 'UTC' }) : "-"}
                </td>
                <td className='py-4 px-4'>
                    <div className='flex items-center gap-2'>
                        <Tooltip content="Editar Info">
                            <button
                                onClick={() => {
                                    setEditingRole(role);
                                    setNewRole({ name: role.name, description: role.description || '' });
                                    setIsCreateModalOpen(true);
                                }}
                                className='p-1.5 bg-slate-100 rounded-md hover:bg-slate-200 text-slate-600'
                            >
                                <Pencil size={16} />
                            </button>
                        </Tooltip>
                        <Tooltip content="Eliminar">
                            <button
                                onClick={() => handleDeleteClick(role)}
                                disabled={role.is_system_role}
                                className={`p-1.5 rounded-md text-white transition-colors ${role.is_system_role ? 'bg-slate-200 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </Tooltip>
                    </div>
                </td>
            </tr>
        );
    };

    const renderMobileCard = (role: any) => {
        return (
            <div key={role.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative">
                {/* Header: Nombre y Acciones */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className='font-bold text-base text-gray-800'>{role.name}</p>
                        <p className='text-xs text-gray-500 line-clamp-1'>{role.description || 'Sin descripción'}</p>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleActionMenu(role.id)}
                            className="p-1.5 text-gray-500 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {openActionMenu === role.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                                <button
                                    onClick={() => {
                                        setOpenActionMenu(null);
                                        setEditingRole(role);
                                        setNewRole({ name: role.name, description: role.description || '' });
                                        setIsCreateModalOpen(true);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2"
                                >
                                    <Pencil size={16} /> Editar
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenActionMenu(null);
                                        handleDeleteClick(role);
                                    }}
                                    disabled={role.is_system_role}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${role.is_system_role ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                                >
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">ID</p>
                        <p className="font-mono text-slate-600">{role.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Sistema</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${role.is_system_role ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {role.is_system_role ? 'Sí' : 'No'}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Creado El</p>
                        <p>{role.created_at ? new Date(role.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Actualizado El</p>
                        <p>{role.updated_at ? new Date(role.updated_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Configuración', href: '/settings/users-permissions' },
                { label: 'Roles', href: '/settings/roles', active: true }
            ]} />
            <div className='bg-white w-full max-h-max rounded-lg p-4 sm:p-5 mb-9 shadow-md'>
                <div className='w-full h-full'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
                        <div>
                            <h1 className='text-black font-[700] text-xl sm:text-2xl'>Gestión de Roles</h1>
                            <p className='text-sm sm:text-md text-gray-500'>Administra los niveles de acceso y perfiles del sistema.</p>
                        </div>
                        <div className='flex items-center gap-3 w-full sm:w-auto justify-end'>
                            <button
                                onClick={() => {
                                    setEditingRole(null);
                                    setNewRole({ name: '', description: '' });
                                    setIsCreateModalOpen(true);
                                }}
                                className='bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md text-sm sm:text-base'
                            >
                                <Plus size={18} />
                                <span>Crear Nuevo Rol</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden md:block">
                        <Table data={roles} headers={headers} renderRow={renderRow} isLoading={loading} />
                    </div>

                    {/* Mobile: Cards */}
                    <div className="md:hidden mt-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color"></div>
                            </div>
                        ) : roles.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {roles.map((role) => renderMobileCard(role))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-slate-100">
                                No se encontraron roles configurados.
                            </div>
                        )}
                    </div>

                    {!loading && roles.length === 0 && (
                        <div className='hidden md:flex py-20 flex-col items-center justify-center text-center'>
                            <p className='text-slate-500 font-medium'>No se encontraron roles configurados.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Role Modal */}
            {isCreateModalOpen && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200'>
                    <div className='bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200'>
                        <div className='bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between'>
                            <h2 className='font-bold text-lg text-slate-800'>{editingRole ? 'Editar Rol' : 'Nuevo Rol'}</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className='text-slate-400 hover:text-slate-600'>
                                <Plus size={20} className='rotate-45' />
                            </button>
                        </div>
                        <form onSubmit={handleSaveRole} className='p-6 space-y-4'>
                            <InputField
                                input={{
                                    type: 'text',
                                    id: 'role-name',
                                    label: 'Nombre del Rol',
                                    placeholder: 'Ej: Agente, Gerente de ventas, Administrador',
                                    value: newRole.name,
                                    onChange: (e: any) => setNewRole({ ...newRole, name: e.target.value }),
                                    required: true
                                }}
                            />
                            <InputField
                                input={{
                                    type: 'text',
                                    id: 'role-desc',
                                    label: 'Descripción (Opcional)',
                                    placeholder: 'Ej. Gestiona propiedades y clientes.',
                                    value: newRole.description,
                                    onChange: (e: any) => setNewRole({ ...newRole, description: e.target.value })
                                }}
                            />
                            <div className='pt-4 flex gap-3'>
                                <button
                                    type='button'
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className='flex-1 py-2.5 px-4 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all shadow-md'
                                >
                                    Cancelar
                                </button>
                                <button
                                    type='submit'
                                    disabled={isCreating}
                                    className='flex-1 py-2.5 px-4 rounded-lg font-bold text-white bg-primary_color hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2'
                                >
                                    {isCreating ? <Loader2 className='animate-spin' size={18} /> : null}
                                    <Save size={18} /> Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, item: null })}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Rol"
                itemName={deleteModal.item?.name}
                isDeleting={isDeleting}
            />
        </>
    );
}

export default RolesList;
