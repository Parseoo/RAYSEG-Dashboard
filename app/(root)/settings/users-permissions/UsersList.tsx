"use client"

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Tag } from '@/components/ui/badges';
import { Table } from '@/components/ui/table';
import { statusOptions, typeOptions } from './selectUsers';
import Search from '@/components/ui/Search';
import FilterSidebar from '@/components/ui/FilterSidebar';
import DeleteModal from '@/components/ui/DeleteModal';
import Tooltip from '@/components/ui/Tooltip';
import { DeleteUser, GetAllUsers } from '@/lib/api/user-api';
import { useRouter } from 'next/navigation';
import { UserResponse } from '@/lib/@type';
import { showToast } from 'nextjs-toast-notify';

const headers = ['Imagen', 'Usuario', 'Rol', 'Estatus', 'Último acceso', 'Acciones'];

function UsersList() {
    const router = useRouter();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: UserResponse | null }>({ isOpen: false, item: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await GetAllUsers();
                setUsers(data?.users || []);
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
    }, []);

    const filteredUsers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return users.filter(user => {
            const firstName = (user.name || "").toLowerCase();
            const lastName = (user.paternal_last_name || "").toLowerCase();
            const secondLastName = (user.maternal_last_name || "").toLowerCase();
            const fullName = `${firstName} ${lastName} ${secondLastName}`.trim();
            const email = (user.email || "").toLowerCase();
            const matchesSearch =
                term === "" ||
                firstName.includes(term) ||
                lastName.includes(term) ||
                secondLastName.includes(term) ||
                fullName.includes(term) ||
                email.includes(term);
            const matchesRole =
                selectedRole === "all" ||
                (selectedRole === "admin" && (user.role === "admin" || user.is_staff)) ||
                (selectedRole === "editor" && (user.role === "editor" || user.is_superuser)) ||
                user.role === selectedRole;
            const matchesStatus =
                selectedStatus === "all" ||
                user.is_active === (selectedStatus === "true");
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, selectedRole, selectedStatus]);

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
        const role = user.role
            ? typeOptions.find(opt => opt.value === user.role)?.label || user.role
            : user.is_superuser ? "SuperAdmin" : user.is_staff ? "Administrador" : "Usuario";
        return (
            <tr key={user.id} className='border-b border-slate-100 hover:bg-gray-50 transition-colors'>
                <td className='py-4 px-4'>
                    <Image src='/user.svg' alt={fullName} width={60} height={60} className='rounded-lg object-cover w-[60px] h-[60px]' />
                </td>
                <td className='py-4 px-4'>
                    <p className='font-medium text-sm'>{fullName}</p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                </td>
                <td className='py-4 px-4 text-sm text-gray-700'>{role}</td>
                <td className='py-4 px-4'>
                    <Tag status={user.is_active ? 'Activo' : 'Inactivo'}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                    </Tag>
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

    const deleteFullName = deleteModal.item
        ? `${deleteModal.item.name} ${deleteModal.item.paternal_last_name ?? ""} ${deleteModal.item.maternal_last_name ?? ""}`.trim()
        : "";

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Usuarios y Permisos', href: '/settings/users-permissions', active: true }
                ]}
            />
            <div className='bg-white w-full rounded-lg p-5 mb-9 shadow-md'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-3'>
                    <div>
                        <h1 className='text-xl font-bold'>Listado de usuarios</h1>
                        <p className='text-gray-500 text-sm'>Administra quién puede acceder al sistema.</p>
                    </div>
                </div>
                <div className='mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                    <Search
                        title='Buscar por nombre o correo'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full sm:w-auto sm:min-w-[420px]'
                    />
                    <div className='flex items-center gap-2 sm:gap-4'>
                        <button onClick={() => setIsFilterOpen(true)} className='p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200'>
                            <SlidersHorizontal size={20} className='text-gray-600' />
                        </button>
                        <Link href='/settings/users-permissions/add-user' className='flex-1 sm:flex-initial'>
                            <button className='bg-primary_color text-white w-full sm:w-auto px-4 h-[40px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium text-sm'>
                                <UserPlus size={18} />
                                <span>Agregar Usuario</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <Table data={filteredUsers} headers={headers} renderRow={renderRow} isLoading={loading} />
            </div>

            <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filtrar Usuarios">
                <div className="space-y-4">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                            <SelectValue placeholder='Rol' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {typeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder='Estatus' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {statusOptions.map(option => (
                                <SelectItem key={String(option.value)} value={String(option.value)}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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