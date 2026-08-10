"use client"

import React, { useState, useEffect, useCallback, useRef } from "react";
import { CirclePlus, CloudUpload, Eye, Image as ImageIcon, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import * as LucideIcons from "lucide-react";
import { DynamicInputs, InputFieldConfig } from "@/components/ui/Input";
import { inputsServicesSection } from "../inputConfig";
import DragAndDrop, { Item } from '@/components/ui/DragAndDrop';
import IconSelector from "@/components/ui/IconSelector";
import DeleteModal from "@/components/ui/DeleteModal";
import { CreateCatalogItems, GetAllCatalogs } from "@/lib/api/catalog-api";
import { CreateServiceItem, GetServices, DeleteServiceItem, UpdateServiceItem, UploadHeaderImage, DeleteHeaderImage, UpdateServices } from "@/lib/api/web-content-api";
import { ServiceItem, ServicesRequest, HeaderImage } from "@/lib/@type-web";
import { showToast } from "nextjs-toast-notify";
import { getImageUrl } from "@/lib/utils";

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

interface AddServicesProps {
    onSaveHeaderRef?: React.MutableRefObject<(() => Promise<void>) | null>;
    onClearRef?: React.MutableRefObject<(() => void) | null>;
}

export const AddServices = ({ onSaveHeaderRef, onClearRef }: AddServicesProps) => {

    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedHeaderImage, setSelectedHeaderImage] = useState<{ id?: number; image_url: string } | null>(null);
    const [showIconSelector, setShowIconSelector] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<keyof typeof LucideIcons>("CirclePlus");

    // Estado del formulario para nuevo servicio
    const [serviceTitle, setServiceTitle] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Estado de la lista de servicios
    const [serviceItems, setServiceItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [headerImages, setHeaderImages] = useState<HeaderImage[]>([]);
    const [headerImage, setHeaderImage] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [deleteImageModal, setDeleteImageModal] = useState<{ isOpen: boolean; item: HeaderImage | null }>({ isOpen: false, item: null });
    const [isDeletingImage, setIsDeletingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estado para el encabezado de la sección de servicios
    const [servicesHeader, setServicesHeader] = useState({
        titleServices: "",
        serviceDescription: ""
    });

    // Estado para modal de eliminación de servicio
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: Item | null }>({ isOpen: false, item: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // Estado para edición de servicio
    const [editingService, setEditingService] = useState<Item | null>(null);

    const SelectedIconComponent = LucideIcons[selectedIcon] as LucideIcons.LucideIcon;

    useEffect(() => {
        if (onClearRef) {
            onClearRef.current = () => {
                setServicesHeader({ titleServices: "", serviceDescription: "" });
                setHeaderImage(null);
                setHeaderImages([]);
            };
        }
    }, [onClearRef]);

    // Cargar servicios existentes
    const fetchServices = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await GetServices();

            if (res?.data?.services) {
                const items = res.data.services.map((service: ServiceItem) => ({
                    id: String(service.id),
                    title: service.name,
                    description: service.description || "",
                    icon: LucideIcons[service.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon || undefined,
                }));
                setServiceItems(items);
            }
        } catch (error) {
            console.error("Error al cargar servicios:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Cargar imagen de encabezado existente y datos del header
    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const res = await GetServices();
                if (res.data?.header_images && res.data.header_images.length > 0) {
                    setHeaderImages(res.data.header_images);
                } else {
                    setHeaderImages([]);
                }
                if (res.data?.header_image_url) {
                    setHeaderImage(res.data.header_image_url);
                } else {
                    setHeaderImage(null);
                }
                if (res.data?.title) {
                    setServicesHeader({
                        titleServices: res.data.title,
                        serviceDescription: res.data.description || ""
                    });
                }
            } catch (error) {
                console.error("Error al cargar imagen de encabezado:", error);
            }
        };
        fetchHeaderData();
    }, []);

    // Manejar subida de imagen de encabezado en base64
    const handleHeaderImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploadingImage(true);
        try {
            const base64Images: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const base64 = await fileToBase64(files[i]);
                base64Images.push(base64);
            }

            const res = await UploadHeaderImage({ images: base64Images });

            if (res?.data?.header_images && res.data.header_images.length > 0) {
                setHeaderImages(res.data.header_images);
            } else {
                // Si la respuesta no trae header_images, refrescar datos
                const refreshed = await GetServices();
                if (refreshed.data?.header_images) {
                    setHeaderImages(refreshed.data.header_images);
                }
                if (refreshed.data?.header_image_url) {
                    setHeaderImage(refreshed.data.header_image_url);
                }
            }

            if (res?.data?.header_image_url) {
                setHeaderImage(res.data.header_image_url);
            }

            showToast.success(base64Images.length === 1 ? "Imagen de encabezado subida correctamente" : "Imágenes de encabezado subidas correctamente");
        } catch (error: any) {
            console.error("Error al subir imagen:", error);
            showToast.error(error?.response?.data?.detail || error?.response?.data?.message || "Error al subir la imagen");
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteHeaderImage = (image: HeaderImage) => {
        setDeleteImageModal({ isOpen: true, item: image });
    };

    const handleDeleteHeaderImageConfirm = async () => {
        if (!deleteImageModal.item) return;
        setIsDeletingImage(true);
        const imageId = deleteImageModal.item.id;
        try {
            await DeleteHeaderImage(imageId);
            setHeaderImages(prev => prev.filter(img => img.id !== imageId));
            if (headerImages.length <= 1) {
                setHeaderImage(null);
            }
            showToast.success("Imagen eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            showToast.error("Error al eliminar la imagen");
        } finally {
            setIsDeletingImage(false);
            setDeleteImageModal({ isOpen: false, item: null });
        }
    };

    const handleViewHeaderImage = (image: { id?: number; image_url: string }) => {
        setSelectedHeaderImage(image);
        setOpenImageModal(true);
    };

    // Guardar encabezado de servicios (título y descripción)
    const handleSaveServicesHeader = async () => {
        try {
            const payload: ServicesRequest = {
                title: servicesHeader.titleServices,
                description: servicesHeader.serviceDescription
            };
            await UpdateServices(payload);
            showToast.success("Encabezado de servicios guardado correctamente");
        } catch (error) {
            console.error("Error al guardar encabezado:", error);
            showToast.error("Error al guardar el encabezado de servicios");
        }
    };

    // Exponer función de guardado para el padre via ref
    React.useEffect(() => {
        if (onSaveHeaderRef) {
            onSaveHeaderRef.current = handleSaveServicesHeader;
        }
    }, [onSaveHeaderRef, servicesHeader]);

    // Manejar el clic en "Agregar Servicio" o "Actualizar Servicio"
    const handleAddService = async () => {
        if (!serviceTitle.trim()) {
            showToast.warning("El nombre del servicio es obligatorio", {
                duration: 4000,
                position: "top-right",
                transition: "topBounce",
                icon: "",
                sound: true,
            });
            return;
        }

        try {
            setIsSaving(true);

            if (editingService) {
                const payload: ServiceItem = {
                    id: Number(editingService.id),
                    icon: "",
                    name: serviceTitle,
                    description: serviceDescription || "",
                    order: serviceItems.findIndex(s => s.id === editingService.id) + 1,
                };

                await UpdateServiceItem(Number(editingService.id), payload);

                showToast.success("Servicio actualizado exitosamente", {
                    duration: 4000,
                    position: "top-right",
                    transition: "topBounce",
                    icon: "",
                    sound: true,
                });

                // Limpiar formulario y salir del modo edición
                setEditingService(null);
                setServiceTitle("");
                setServiceDescription("");
                setSelectedIcon("CirclePlus");
            } else {
                const payload: ServiceItem = {
                    icon: "",
                    name: serviceTitle,
                    description: serviceDescription || "",
                    order: serviceItems.length + 1,
                };

                await CreateServiceItem(payload);

                showToast.success("Servicio agregado exitosamente", {
                    duration: 4000,
                    position: "top-right",
                    transition: "topBounce",
                    icon: "",
                    sound: true,
                });

                // Limpiar formulario
                setServiceTitle("");
                setServiceDescription("");
                setSelectedIcon("CirclePlus");
            }

            // Recargar la lista
            await fetchServices();

        } catch (error: any) {
            console.error("Error al procesar servicio:", error);
            showToast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                (editingService ? "Error al actualizar el servicio" : "Error al agregar el servicio"),
                {
                    duration: 5000,
                    position: "top-right",
                    transition: "topBounce",
                    icon: "",
                    sound: true,
                }
            );
        } finally {
            setIsSaving(false);
        }
    };

    // Manejar eliminación de servicio
    const handleDeleteService = (item: Item) => {
        setDeleteModal({ isOpen: true, item });
    };

    // Manejar edición de servicio
    const handleEditService = (item: Item) => {
        setEditingService(item);
        setServiceTitle(item.title);
        setServiceDescription(item.description || "");
        // Find and set the icon
        const iconName = Object.keys(LucideIcons).find(key =>
            LucideIcons[key as keyof typeof LucideIcons] === item.icon
        ) as keyof typeof LucideIcons;
        if (iconName) {
            setSelectedIcon(iconName);
        }
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setEditingService(null);
        setServiceTitle("");
        setServiceDescription("");
        setSelectedIcon("CirclePlus");
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.item) return;
        setIsDeleting(true);
        try {
            const itemId = Number(deleteModal.item.id);
            await DeleteServiceItem(itemId);
            setServiceItems(prev => prev.filter(s => s.id !== deleteModal.item!.id));
            showToast.success("Servicio eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar servicio:", error);
            showToast.error("Error al eliminar el servicio");
        } finally {
            setIsDeleting(false);
            setDeleteModal({ isOpen: false, item: null });
        }
    };

    // Inputs controlados para el formulario de nuevo servicio
    const inputsServiceItemControlled: InputFieldConfig[] = [
        {
            type: 'text',
            id: 'serviceTitle',
            label: 'Nombre del servicio',
            placeholder: 'Nombre del servicio (ej. Asesoría Legal)',
            value: serviceTitle,
            onChange: (e: any) => setServiceTitle(e.target ? e.target.value : e),
        },
        {
            type: 'text',
            id: 'serviceDescription',
            label: 'Breve descripción',
            placeholder: 'Breve descripción...',
            value: serviceDescription,
            onChange: (e: any) => setServiceDescription(e.target ? e.target.value : e),
        }
    ];

    // Inputs controlados para el encabezado de la sección de servicios
    const inputsServicesHeaderControlled: InputFieldConfig[] = inputsServicesSection.map(input => ({
        ...input,
        value: servicesHeader[input.id as keyof typeof servicesHeader] || "",
        onChange: (e: any) => {
            const value = e?.target ? e.target.value : e;
            setServicesHeader(prev => ({ ...prev, [input.id]: value }));
        }
    }));

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <div className='flex justify-between items-center mb-1'>
                    <h1 className='font-[500] text-lg'>Encabezado de la sección de servicios</h1>
                    {headerImages.length > 0 && (
                        <span className='text-sm text-gray-500 font-medium'>
                            {headerImages.length} {headerImages.length === 1 ? 'imagen cargada' : 'imágenes cargadas'}
                        </span>
                    )}
                </div>
                <p className='text-md text-gray-500'>Fotos a mostrar en la sección de servicios.</p>
                <div className='mt-4'>
                    <DynamicInputs inputs={inputsServicesHeaderControlled} withBgWhite={true} />
                </div>

                <div
                    className='bg-white flex items-center justify-center w-full mt-5 rounded-md'
                    onClick={() => fileInputRef.current?.click()}>
                    <div className='flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-md hover:bg-blue-50  hover:border-blue-500 transition-colors cursor-pointer'>
                        {isUploadingImage ? (
                            <div className='flex flex-col items-center justify-center text-body pt-5 pb-6'>
                                <Loader2 size={30} className='mb-3 text-blue-500 animate-spin' />
                                <p className='mb-2 text-sm font-semibold'>Subiendo imagen(es)...</p>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center text-body pt-5 pb-6'>
                                <CloudUpload size={30} className='mb-3 text-blue-500' />
                                <p className='mb-2 text-sm font-semibold'>Haz click o arrastra imagenes aquí </p>
                                <div className='inline-flex items-center text-sm font-medium'>
                                    <ImageIcon size={20} className='mr-2' />
                                    Seleccionar archivos
                                </div>
                                <p className='text-sm mt-2 text-gray-500'>Formatos JPG/PNG <span className='font-semibold'>30MB</span> por foto.</p>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        id='dropzone-file-2'
                        type='file'
                        className='hidden'
                        onChange={handleHeaderImageChange}
                        accept="image/*"
                        multiple
                        disabled={isUploadingImage}
                    />
                </div>

                {headerImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                        {headerImages.map((image) => (
                            <div key={image.id} className="group w-full relative aspect-video rounded-lg overflow-hidden border shadow-sm bg-gray-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={getImageUrl(image.image_url)}
                                    alt="Imagen de encabezado"
                                    className="object-contain w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 z-10" />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewHeaderImage(image);
                                    }}
                                    className="absolute top-2 left-2 p-1.5 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                                    title="Ver imagen"
                                >
                                    <Eye size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteHeaderImage(image);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                                    title="Eliminar imagen"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : headerImage ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                        <div className="group w-full relative aspect-video rounded-lg overflow-hidden border shadow-sm bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getImageUrl(headerImage)}
                                alt="Imagen de encabezado"
                                className="object-contain w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 z-10" />
                            <button
                                type="button"
                                onClick={() => handleViewHeaderImage({ image_url: headerImage })}
                                className="absolute top-2 left-2 p-1.5 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                                title="Ver imagen"
                            >
                                <Eye size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setHeaderImage(null)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                                title="Quitar imagen"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Modal para visualizar imagen en tamaño completo */}
                {openImageModal && selectedHeaderImage && (
                    <div
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setOpenImageModal(false)}>
                        <div
                            className="relative w-full max-w-5xl h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                onClick={() => setOpenImageModal(false)}
                                className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 shadow z-10 transition-colors">
                                <X size={24} />
                            </button>

                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getImageUrl(selectedHeaderImage.image_url)}
                                alt="Vista completa"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                )}

                {/* Modal de confirmación para eliminar imagen */}
                <DeleteModal
                    isOpen={deleteImageModal.isOpen}
                    onClose={() => setDeleteImageModal({ isOpen: false, item: null })}
                    onConfirm={handleDeleteHeaderImageConfirm}
                    title="Eliminar imagen de encabezado"
                    itemName="esta imagen"
                    isDeleting={isDeletingImage}
                />
            </div>

            <div className="bg-slate-100 w-full min-w-full rounded-lg p-5">
                <h1 className="font-[500] text-lg mb-4">
                    Lista de servicios
                </h1>

                <div className="flex flex-col md:flex-row w-full items-stretch md:items-end gap-4 py-3 px-4">


                    <div className="flex-1 md:-mt-7">
                        <DynamicInputs inputs={inputsServiceItemControlled} withBgWhite={true} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handleAddService}
                            className="bg-primary_color text-white w-full sm:w-[200px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md shrink-0 disabled:opacity-60"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Guardando...
                                </>
                            ) : editingService ? (
                                <>
                                    <Save size={20} />
                                    Actualizar Servicio
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Agregar Servicio
                                </>
                            )}
                        </button>

                        {editingService && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-slate-200 text-gray-700 w-full sm:w-[140px] h-[40px] rounded-lg flex items-center justify-center gap-2 px-4 hover:bg-slate-300 transition-opacity font-medium shrink-0"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 w-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8 text-gray-400">
                            <Loader2 size={24} className="animate-spin mr-2" />
                            Cargando servicios...
                        </div>
                    ) : serviceItems.length > 0 ? (
                        <DragAndDrop items={serviceItems} onChange={(items) => setServiceItems(items)} onDelete={handleDeleteService} onEdit={handleEditService} />
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No hay servicios registrados. Agrega uno arriba.
                        </div>
                    )}

                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, item: null })}
                    onConfirm={handleDeleteConfirm}
                    title="Eliminar servicio"
                    itemName={deleteModal.item?.title || ""}
                    isDeleting={isDeleting}                />
                </div>
            </div>
        </>
    )
}