"use client"

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Pencil, Trash2, UserPlus, SlidersHorizontal, User, MoreVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { Table } from '@/components/ui/table';
import Search from '@/components/ui/Search';
import FilterSidebar from '@/components/ui/FilterSidebar';
import DeleteModal from '@/components/ui/DeleteModal';
import Tooltip from '@/components/ui/Tooltip';
import { DeleteUser, GetAllUsers } from '@/lib/api/user-api';
import { GetListRoles } from '@/lib/api/permission-api';
import { useRouter } from 'next/navigation';
import { UserResponse } from '@/lib/@type';
import { showToast } from 'nextjs-toast-notify';
import { statusOptions } from './selectUsers';
import { getUserImageUrl } from '@/lib/utils';

const headers = ['Imagen', 'Usuario', 'Contacto', 'Rol', 'Estatus', 'Creado en', 'Modificado en', 'Acciones'];

function UsersList() {
    const router = useRouter();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: UserResponse | null }>({ isOpen: false, item: null });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [roles, setRoles] = useState<any[]>([]);
    const [openActionMenu, setOpenActionMenu] = useState<string | number | null>(null);
    const PER_PAGE = 10;

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedRole !== 'all') count++;
        if (selectedStatus !== 'all') count++;
        return count;
    }, [selectedRole, selectedStatus]);

    const handleClearFilters = () => {
        setSelectedRole('all');
        setSelectedStatus('all');
        setSearchTerm('');
        setIsFilterOpen(false);
    };

    const handleApplyFilters = () => {
        setIsFilterOpen(false);
    };

    const FilterPills = ({ label, options, selectedValue, onChange }: { label: string, options: any[], selectedValue: string, onChange: (val: string) => void }) => (
        <div className="flex items-center gap-3 flex-shrink-0 max-w-full">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">{label}:</span>
            <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1">
                <button
                    onClick={() => onChange('all')}
                    className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        selectedValue === 'all'
                            ? 'bg-primary_color text-white font-medium shadow-md'
                            : 'bg-slate-100 text-gray-600 hover:bg-slate-200 active:scale-95'
                    }`}
                >
                    Todos
                </button>
                {options.map((opt: any) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                            selectedValue === opt.value
                                ? 'bg-primary_color text-white font-medium shadow-md'
                                : 'bg-slate-100 text-gray-600 hover:bg-slate-200 active:scale-95'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    // Debounce search: wait 400ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset to page 1 whenever any filter changes
    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, selectedRole, selectedStatus]);

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await GetListRoles();
                if (res.data) {
                    const extracted = res.data.items || res.data.catalogItems || (Array.isArray(res.data) ? res.data : (res.data.data && Array.isArray(res.data.data) ? res.data.data : []));
                    setRoles(extracted);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const roleOptions = useMemo(() => {
        return roles.map(role => ({
            label: role.name,
            value: role.name
        }));
    }, [roles]);

    // Filtrado local para garantizar que funcione incluso si la API ignora los parámetros
    const filteredUsers = useMemo(() => {
        let result = users;
        
        if (selectedRole !== 'all') {
            result = result.filter(user => {
                const roleName = typeof user.role === 'object' && user.role !== null ? (user.role as any).name : user.role;
                const role = roleName || (user.is_superuser ? "SuperAdmin" : user.is_staff ? "Administrador" : "Usuario");
                return role === selectedRole;
            });
        }
        
        if (selectedStatus !== 'all') {
            const isActive = selectedStatus === 'true';
            result = result.filter(user => user.is_active === isActive);
        }
        
        if (debouncedSearch) {
            const search = debouncedSearch.toLowerCase();
            result = result.filter(user => {
                const fullName = `${user.name} ${user.paternal_last_name ?? ""} ${user.maternal_last_name ?? ""}`.trim().toLowerCase();
                const email = user.email.toLowerCase();
                return fullName.includes(search) || email.includes(search);
            });
        }
        
        return result;
    }, [users, selectedRole, selectedStatus, debouncedSearch]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const params: Parameters<typeof GetAllUsers>[0] = {
                    page: currentPage,
                    perPage: PER_PAGE,
                };
                if (debouncedSearch)           params.search    = debouncedSearch;
                if (selectedRole !== "all")    params.role      = selectedRole;
                if (selectedStatus !== "all")  params.is_active = selectedStatus === "true";

                const { data } = await GetAllUsers(params);
                setUsers(data?.users || []);
                setTotalCount(data?.count ?? 0);
            } catch (error: any) {
                if (error?.response?.status === 403) {
                    showToast.error(
                        error?.response?.data?.detail ||
                        "Solo los administradores pueden listar usuarios"
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [debouncedSearch, selectedRole, selectedStatus, currentPage]);

    const totalPages = Math.ceil(totalCount / PER_PAGE);

    const handleDeleteClick = (user: UserResponse) => {
        setDeleteModal({ isOpen: true, item: user });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.item) return;
        setIsDeleting(true);
        try {
            const { data } = await DeleteUser(deleteModal.item.id);
            setUsers(prev => prev.filter(u => u.id !== deleteModal.item?.id));
            setDeleteModal({ isOpen: false, item: null });
            showToast.success(data.message);
        } catch (error: any) {
            if (error?.response?.status === 403) {
                setWarningMessage(
                    error?.response?.data?.detail ||
                    "No tienes permisos para eliminar este usuario"
                );
                setShowWarning(true);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const renderRow = (user: UserResponse) => {
        const fullName = `${user.name} ${user.paternal_last_name ?? ""} ${user.maternal_last_name ?? ""}`.trim();
        // user.role es un objeto {id, name}, extraer el name directamente
        const roleName = typeof user.role === 'object' && user.role !== null
            ? (user.role as any).name
            : user.role;
        const role = roleName || (user.is_superuser ? "SuperAdmin" : user.is_staff ? "Administrador" : "Usuario");
        return (
            <tr key={user.id} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
                <td className='py-4 px-4'>
                    <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center'>
                        {user.profile_picture ? (
                            <Image 
                                src={getUserImageUrl(user.profile_picture)} 
                                alt={fullName} 
                                fill
                                sizes="48px"
                                unoptimized={true}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target && !target.src.endsWith('/user.svg')) {
                                        target.src = '/user.svg';
                                    }
                                }}
                                className='object-cover' 
                            />
                        ) : (
                            <User className="w-6 h-6 text-slate-500" />
                        )}
                    </div>
                </td>
                <td className='py-4 px-4'>
                    <p className='font-medium text-sm'>{fullName}</p>
                </td>
                <td className='py-4 px-4'>
                    <p className='font-medium text-sm'>{user.phone || '-'}</p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>{role}</td>
                <td className='py-4 px-4'>
                    <Tag status={user.is_active ? 'Activo' : 'Inactivo'}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                    </Tag>
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>
                    {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "-"}
                </td>
                <td className='py-4 px-4'>
                    <div className='flex items-center gap-2'>
                        <Tooltip content="Ver detalle">
                            <Link href={`/settings/users-permissions/${user.id}`}>
                                <button className='p-1.5 bg-slate-200 rounded-md hover:bg-slate-300'>
                                    <Eye size={16} />
                                </button>
                            </Link>
                        </Tooltip>
                        <Tooltip content="Editar">
                            <Link href={`/settings/users-permissions/edit-user/${user.id}`}>
                                <button className='p-1.5 bg-slate-200 rounded-md hover:bg-slate-300'>
                                    <Pencil size={16} />
                                </button>
                            </Link>
                        </Tooltip>
                        <Tooltip content="Eliminar">
                            <button
                                onClick={() => handleDeleteClick(user)}
                                className='p-1.5 bg-red-500 rounded-md hover:bg-red-600'
                            >
                                <Trash2 size={16} className='text-white' />
                            </button>
                        </Tooltip>
                    </div>
                </td>
            </tr>
        );
    };

    const toggleActionMenu = (id: string | number) => {
        setOpenActionMenu(prev => prev === id ? null : id);
    };

    const renderMobileCard = (user: UserResponse) => {
        const fullName = `${user.name} ${user.paternal_last_name ?? ""} ${user.maternal_last_name ?? ""}`.trim();
        const roleName = typeof user.role === 'object' && user.role !== null
            ? (user.role as any).name
            : user.role;
        const role = roleName || (user.is_superuser ? "SuperAdmin" : user.is_staff ? "Administrador" : "Usuario");

        return (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 relative">
                {/* Header: Image, Info and Actions */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className='relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center'>
                            {user.profile_picture ? (
                                <Image 
                                    src={getUserImageUrl(user.profile_picture)} 
                                    alt={fullName} 
                                    fill
                                    sizes="48px"
                                    unoptimized={true}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (target && !target.src.endsWith('/user.svg')) {
                                            target.src = '/user.svg';
                                        }
                                    }}
                                    className='object-cover' 
                                />
                            ) : (
                                <User className="w-6 h-6 text-slate-500" />
                            )}
                        </div>
                        <div>
                            <p className='font-bold text-base text-gray-800'>{fullName}</p>
                        </div>
                    </div>
                    
                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => toggleActionMenu(user.id)}
                            className="p-1.5 text-gray-500 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>
                        
                        {openActionMenu === user.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1">
                                <Link href={`/settings/users-permissions/${user.id}`}>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2">
                                        <Eye size={16} /> Ver
                                    </button>
                                </Link>
                                <Link href={`/settings/users-permissions/edit-user/${user.id}`}>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 flex items-center gap-2">
                                        <Pencil size={16} /> Editar
                                    </button>
                                </Link>
                                <button 
                                    onClick={() => {
                                        setOpenActionMenu(null);
                                        handleDeleteClick(user);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Contacto</p>
                        <p className="truncate text-sm" title={user.email}>{user.email || '-'}</p>
                        <p className="text-xs text-gray-600">{user.phone || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Estatus</p>
                        <Tag status={user.is_active ? 'Activo' : 'Inactivo'}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                        </Tag>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Rol</p>
                        <p>{role}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Creado en</p>
                        <p>{user.created_at ? new Date(user.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-0.5">Modificado en</p>
                        <p>{user.updated_at ? new Date(user.updated_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</p>
                    </div>
                </div>
            </div>
        );
    };

    const deleteFullName = deleteModal.item
        ? `${deleteModal.item.name} ${deleteModal.item.paternal_last_name ?? ""} ${deleteModal.item.maternal_last_name ?? ""}`.trim()
        : "";

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Configuración', href: '/settings/users-permissions' },
                    { label: 'Usuarios', href: '/settings/users-permissions', active: true }
                ]}
            />
            <div className='bg-white w-full rounded-lg p-5 mb-9 shadow-md'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
                    <div>
                        <h1 className='text-xl font-bold'>Listado de usuarios</h1>
                        <p className='text-gray-500 text-sm'>Administra quién puede acceder al sistema.</p>
                    </div>
                    <div className='flex items-center gap-3 w-full sm:w-auto justify-end'>
                        <button
                            type='button'
                            onClick={() => setIsFilterOpen(true)}
                            className='p-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center relative border border-slate-200 shadow-sm gap-2'
                        >
                            <SlidersHorizontal size={20} className='text-gray-600' />
                            <span className='text-sm text-gray-600'>Filtros</span>
                            {activeFiltersCount > 0 && (
                                <span className='absolute -top-2 -right-2 bg-primary_color text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm'>
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        <Link href='/settings/users-permissions/add-user' className='w-full sm:w-auto'>
                            <button className='bg-primary_color text-white w-full sm:w-auto px-4 h-[40px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium shadow-md text-sm'>
                                <UserPlus size={18} />
                                <span>Agregar Usuario</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="mb-6 space-y-4">
                    {/* Buscador y Filtros Lado a Lado */}
                    <div className='flex flex-col lg:flex-row lg:items-center gap-4 w-full'>
                        <Search
                            title='Buscar por nombre, apellido o correo'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-[350px] w-full"
                        />
                        <div className='flex flex-wrap lg:flex-nowrap items-center gap-4 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1'>
                            <FilterPills
                                label="Rol"
                                options={roleOptions}
                                selectedValue={selectedRole}
                                onChange={setSelectedRole}
                            />
                            <FilterPills
                                label="Estatus"
                                options={statusOptions}
                                selectedValue={selectedStatus}
                                onChange={setSelectedStatus}
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden md:block">
                    <Table data={filteredUsers} headers={headers} renderRow={renderRow} isLoading={loading} />
                </div>

                <div className="md:hidden mt-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_color"></div>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {filteredUsers.map((user) => renderMobileCard(user))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-slate-100">
                            No hay registros disponibles
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='flex items-center justify-between mt-4 pt-4 border-t border-slate-100'>
                        <p className='text-sm text-gray-500'>
                            Mostrando {filteredUsers.length} de {totalCount} usuarios
                        </p>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className='px-3 py-1.5 text-sm rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                            >
                                Anterior
                            </button>
                            <span className='text-sm text-gray-600'>
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className='px-3 py-1.5 text-sm rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onClear={handleClearFilters}
                onApply={handleApplyFilters}
                title="Filtros"
            >
                <div className="space-y-6 pt-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Rol</label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos los roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los roles</SelectItem>
                                {roleOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Estatus</label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos los estatus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estatus</SelectItem>
                                {statusOptions.map(option => (
                                    <SelectItem key={String(option.value)} value={String(option.value)}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </FilterSidebar>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, item: null })}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Usuario"
                itemName={deleteFullName}
                isDeleting={isDeleting}
            />
            <DeleteModal
                isOpen={showWarning}
                onClose={() => { setShowWarning(false); router.push('/settings/my-profile'); }}
                title="Error"
                variant="warning"
                message={warningMessage}
            />
        </>
    );
}

export default UsersList;