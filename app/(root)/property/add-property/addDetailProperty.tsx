"use client"

import React, { useState, useRef, useEffect } from 'react';
import { CirclePlus, Plus, Loader2, Pencil, Trash2, ChevronDown } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { ItemResponse } from '@/lib/@type';
import { CreateCatalogItems } from '@/lib/api/catalog-api';
import { showToast } from 'nextjs-toast-notify';

import DragAndDrop, { Item } from '@/components/ui/DragAndDrop';
import IconSelector from "@/components/ui/IconSelector";
import DeleteModal from "@/components/ui/DeleteModal";

import { useProperty } from '../propertyContext';
import { inputsDetailProperty } from '../inputConfig';

const AmenitiesManager = ({
    catalog,
    selectedValues,
    onChange
}: {
    catalog: any[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
}) => {
    const [serviceTitle, setServiceTitle] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editingService, setEditingService] = useState<Item | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: Item | null }>({ isOpen: false, item: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { fetchCatalogs } = useProperty();
    const [localAddedAmenities, setLocalAddedAmenities] = useState<Record<string, { title: string; description: string; icon: string }>>({});

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const serviceItems: Item[] = selectedValues.map(val => {
        const catItem = catalog.find(c => String(c.catalogItemID) === val || c.value === val);
        console.log('Looking for amenity:', val, 'Found:', catItem);
        if (catItem) {
            const iconName = localAddedAmenities[val]?.icon || catItem.icon || "Check";
            const IconComponent = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Check) as React.ComponentType<{ className?: string }>;
            return {
                id: val,
                title: catItem.name || catItem.label || "Amenidad Desconocida",
                description: catItem.description || "",
                icon: IconComponent
            };
        } else if (localAddedAmenities[val]) {
            const localItem = localAddedAmenities[val];
            const IconComponent = (LucideIcons[localItem.icon as keyof typeof LucideIcons] || LucideIcons.Check) as React.ComponentType<{ className?: string }>;
            return {
                id: val,
                title: localItem.title,
                description: localItem.description,
                icon: IconComponent
            };
        } else {
            return {
                id: val,
                title: "Amenidad Desconocida",
                description: "",
                icon: LucideIcons.Check
            };
        }
    });

    const handleAddService = async () => {
        if (!serviceTitle.trim()) {
            showToast.warning("El nombre es requerido");
            return;
        }

        setIsSaving(true);
        try {
            if (editingService) {
                const id = editingService.id;
                setLocalAddedAmenities(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        title: serviceTitle.trim(),
                        description: serviceDescription.trim(),
                        icon: prev[id]?.icon || "Check"
                    }
                }));
                setEditingService(null);
                setServiceTitle("");
                setServiceDescription("");
            } else {
                const existing = catalog.find(c =>
                    (c.name || c.label || "").toLowerCase() === serviceTitle.trim().toLowerCase()
                );
                if (!existing) {
                    showToast.warning("Debes seleccionar una amenidad existente del catálogo.");
                    setIsSaving(false);
                    return;
                }
                const newId = String(existing.catalogItemID || existing.value);
                setLocalAddedAmenities(prev => ({
                    ...prev,
                    [newId]: {
                        title: existing.name || existing.label,
                        description: serviceDescription.trim() || existing.description || "",
                        icon: existing.icon || "Check"
                    }
                }));

                if (!selectedValues.includes(newId)) {
                    onChange([...selectedValues, newId]);
                } else {
                    showToast.warning("Esta amenidad ya ha sido agregada");
                }
                setServiceTitle("");
                setServiceDescription("");
            }
        } catch (error) {
            console.error(error);
            showToast.error("Error al guardar amenidad");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingService(null);
        setServiceTitle("");
        setServiceDescription("");
    };

    const handleEditService = (item: Item) => {
        setEditingService(item);
        setServiceTitle(item.title);
        setServiceDescription(item.description || "");
    };

    const handleDeleteService = (item: Item) => {
        setDeleteModal({ isOpen: true, item });
    };

    const handleDeleteConfirm = () => {
        if (deleteModal.item) {
            onChange(selectedValues.filter(v => v !== deleteModal.item!.id));
        }
        setDeleteModal({ isOpen: false, item: null });
    };

    return (
        <div className="bg-white w-full rounded-lg p-4 sm:p-5 border border-gray-200">
            <h1 className="font-[500] text-lg mb-1">
                Amenidades
            </h1>
            <p className='text-sm sm:text-md text-gray-500 mb-4'>
                Agrega las amenidades y servicios disponibles en la propiedad.
            </p>

            <div className="w-full py-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 w-full">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5 relative" ref={dropdownRef}>
                        <label htmlFor="serviceTitle" className="text-sm font-medium text-gray-700">
                            Nombre de la amenidad
                        </label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="serviceTitle"
                                placeholder="Selecciona o agrega una amenidad..."
                                value={serviceTitle}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setServiceTitle(val);
                                    setIsOpen(true);
                                    const matched = catalog.find(item => (item.label || item.name) === val);
                                    if (matched) {
                                        setServiceDescription(matched.description || "");
                                    }
                                }}
                                onFocus={() => setIsOpen(true)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm h-[42px] pr-10"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer pointer-events-none text-gray-400">
                                <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>

                        {isOpen && (
                            <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 p-1">
                                {catalog.filter(item =>
                                    (item.label || item.name || '').toLowerCase().includes(serviceTitle.toLowerCase())
                                ).length > 0 ? (
                                    catalog
                                        .filter(item =>
                                            (item.label || item.name || '').toLowerCase().includes(serviceTitle.toLowerCase())
                                        )
                                        .map((item) => (
                                            <div
                                                key={item.value}
                                                onClick={() => {
                                                    setServiceTitle(item.label || item.name || '');
                                                    setServiceDescription(item.description || '');
                                                    setIsOpen(false);
                                                }}
                                                className="px-3 py-2 text-sm text-gray-900 rounded-sm cursor-pointer hover:bg-slate-100 transition-colors"
                                            >
                                                {item.label || item.name}
                                            </div>
                                        ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-gray-500 italic">
                                        No se encontró la amenidad &quot;{serviceTitle}&quot;.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handleAddService}
                            className="bg-primary_color text-white w-full sm:w-auto sm:min-w-[180px] h-[42px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium text-sm shadow-md shrink-0 disabled:opacity-60"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : editingService ? (
                                <>
                                    <Plus size={18} />
                                    Actualizar Amenidad
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Agregar Amenidad
                                </>
                            )}
                        </button>
                        {editingService && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-slate-200 text-gray-700 w-full sm:w-auto px-4 h-[42px] rounded-lg flex items-center justify-center gap-2 hover:bg-slate-300 transition-opacity font-medium text-sm shrink-0"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 w-full">
                {serviceItems.length > 0 ? (
                    <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                        <table className="w-full min-w-[480px] text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-slate-50 border-b border-gray-200">
                                    <th className="py-2.5 px-3 font-semibold text-xs text-gray-600 w-16 text-center">Icono</th>
                                    <th className="py-2.5 px-3 font-semibold text-xs text-gray-600">Nombre</th>
                                    <th className="py-2.5 px-3 font-semibold text-xs text-gray-600">Descripción</th>
                                    <th className="py-2.5 px-3 font-semibold text-xs text-gray-600 text-right w-24">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {serviceItems.map((item) => {
                                    const Icon = item.icon as any;
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-3 text-center">
                                                <div className="bg-blue-50 p-1.5 rounded-md inline-flex items-center justify-center">
                                                    {Icon ? <Icon size={16} className="text-blue-600" /> : <LucideIcons.Check size={16} className="text-blue-600" />}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-sm font-medium text-gray-900">{item.title}</td>
                                            <td className="py-3 px-3 text-sm text-gray-600">{item.description || '-'}</td>
                                            <td className="py-3 px-3 text-sm text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditService(item)}
                                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-gray-600 rounded-md transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteService(item)}
                                                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                        Las amenidades agregadas aparecerán aquí.
                    </div>
                )}

                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, item: null })}
                    onConfirm={handleDeleteConfirm}
                    title="Eliminar amenidad"
                    itemName={deleteModal.item?.title || ""}
                    isDeleting={isDeleting}
                />
            </div>
        </div>
    );
};

export const AddDetailProperty = () => {
    const { state, updateField, amenitiesCatalog, conservationStatusCatalog, terrainTypeCatalog } = useProperty();

    // Definir qué campos se muestran según el tipo de propiedad
    const getVisibleFields = (propertyType: string) => {
        const type = propertyType?.toLowerCase() || '';
        return {
            terrain_size: type === 'casa' || type === 'terreno',
            construction_size: type === 'casa' || type === 'departamento' || type === 'apartamento' || type === 'local' || type === 'oficina',
            rooms: type === 'casa' || type === 'departamento' || type === 'apartamento',
            bathrooms: type === 'casa' || type === 'departamento' || type === 'apartamento' || type === 'local' || type === 'oficina',
            parking_spaces: type === 'casa' || type === 'departamento' || type === 'apartamento' || type === 'local' || type === 'oficina',
            floors: type === 'casa',
            ambientes: type === 'casa' || type === 'departamento' || type === 'apartamento',
            construction_year: type === 'casa' || type === 'departamento' || type === 'apartamento' || type === 'local' || type === 'oficina',
            terrain_type: type === 'terreno' || type === 'casa',
            conservation_status: type === 'casa' || type === 'departamento' || type === 'apartamento' || type === 'local' || type === 'oficina',
        };
    };

    const visibleFields = getVisibleFields(state.property_type);

    const mappedInputs = inputsDetailProperty
        .filter(input => {
            // Siempre mostrar todos los campos si property_type no está seleccionado
            if (!state.property_type) return true;
            return visibleFields[input.id as keyof typeof visibleFields] !== false;
        })
        .map(input => {
            if (input.id === 'conservation_status') {
                return {
                    ...input,
                    options: (conservationStatusCatalog || []).map(item => ({
                        label: item.name,
                        value: item.name
                    })),
                    value: state[input.id as keyof typeof state] as any,
                    onChange: (e: any) => {
                        const val = typeof e === 'string' ? e : e.target.value;
                        const finalVal = (input.type === 'number' || input.type === 'currency')
                            ? (val === '' ? null : Number(val))
                            : val;
                        updateField(input.id as any, finalVal);
                    }
                };
            }
            if (input.id === 'terrain-type' || input.id === 'terrain_type') {
                return {
                    ...input,
                    options: (terrainTypeCatalog || []).map(item => ({
                        label: item.name,
                        value: item.name
                    })),
                    value: state[input.id as keyof typeof state] as any,
                    onChange: (e: any) => {
                        const val = typeof e === 'string' ? e : e.target.value;
                        const finalVal = (input.type === 'number' || input.type === 'currency')
                            ? (val === '' ? null : Number(val))
                            : val;
                        updateField(input.id as any, finalVal);
                    }
                };
            }
            return {
                ...input,
                value: state[input.id as keyof typeof state] as any,
                onChange: (e: any) => {
                    const val = typeof e === 'string' ? e : e.target.value;
                    const finalVal = (input.type === 'number' || input.type === 'currency')
                        ? (val === '' ? null : Number(val))
                        : val;
                    updateField(input.id as any, finalVal);
                }
            };
        });

    const dynamicAmenities = (amenitiesCatalog || []).map((item: ItemResponse) => ({
        ...item,
        value: String(item.catalogItemID),
        label: item.name,
        description: item.description
    }));

    console.log('dynamicAmenities:', dynamicAmenities);
    console.log('state.amenities:', state.amenities);

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-9 border'>
                        <h1 className='font-[500] text-lg'>Caracteristicas</h1>
                        <p className='text-md text-gray-500'>Caracteristicas físicas y comodidades.</p>
                        <div className='mt-6 flex flex-col gap-6'>
                            <DynamicInputs inputs={mappedInputs} withBgWhite={true} />

                            <AmenitiesManager
                                catalog={dynamicAmenities}
                                selectedValues={state.amenities}
                                onChange={(vals) => updateField('amenities', vals)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDetailProperty;
