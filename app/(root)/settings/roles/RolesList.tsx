"use client"

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
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
        if (!newRole.name.trim()) return;
        
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
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        role.is_system_role ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {role.is_system_role ? 'Sí' : 'No'}
                    </span>
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>
                    {role.created_at ? new Date(role.created_at).toLocaleString() : "-"}
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>
                    {role.updated_at ? new Date(role.updated_at).toLocaleString() : "-"}
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

    return (
        <div className='space-y-6 pb-10'>
            <Breadcrumb
                items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Configuración', href: '/settings' },
                    { label: 'Roles', href: '/settings/roles', active: true }
                ]}
            />

            <div className='bg-white w-full rounded-lg p-6 sm:p-8 shadow-xl border border-slate-200'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
                    <div className='flex items-center gap-4'>
                        <div>
                            <h1 className='text-2xl font-extrabold text-slate-900 mb-1'>Gestión de Roles</h1>
                            <p className='text-gray-500 text-sm'>Administra los niveles de acceso y perfiles del sistema.</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            setEditingRole(null);
                            setNewRole({ name: '', description: '' });
                            setIsCreateModalOpen(true);
                        }}
                        className='bg-primary_color text-white px-6 h-[44px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all font-bold text-sm shadow-lg'
                    >
                        <Plus size={18} />
                        <span>Crear Nuevo Rol</span>
                    </button>
                </div>

                <div className='bg-slate-50 rounded-lg border border-slate-100 overflow-hidden'>
                    <Table data={roles} headers={headers} renderRow={renderRow} isLoading={loading} />
                    
                    {!loading && roles.length === 0 && (
                        <div className='py-20 flex flex-col items-center justify-center text-center'>
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
                                    placeholder: 'Ej: Supervisor, Auditor...',
                                    value: newRole.name,
                                    onChange: (e: any) => setNewRole({...newRole, name: e.target.value}),
                                    required: true
                                }}
                            />
                            <InputField 
                                input={{
                                    type: 'text',
                                    id: 'role-desc',
                                    label: 'Descripción (Opcional)',
                                    placeholder: 'Describe brevemente las responsabilidades del rol',
                                    value: newRole.description,
                                    onChange: (e: any) => setNewRole({...newRole, description: e.target.value})
                                }}
                            />
                            <div className='pt-4 flex gap-3'>
                                <button 
                                    type='button'
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className='flex-1 py-2.5 px-4 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors'
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type='submit'
                                    disabled={isCreating || !newRole.name.trim()}
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
        </div>
    );
}

export default RolesList;
