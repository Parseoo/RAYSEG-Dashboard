"use client"

import React, { useState, useEffect, useRef } from 'react';
import { DynamicInputs } from "@/components/ui/Input"
import { inputsAboutUsSection } from "../inputConfig"
import { CloudUpload, Eye, Image as ImageIcon, Loader2, Trash2, X } from 'lucide-react';
import { GetAboutUs, UpdateAboutUs, DeleteCorporateImage, UploadCorporateImage } from '@/lib/api/web-content-api';
import { showToast } from 'nextjs-toast-notify';
import { CorporateImage } from '@/lib/@type-web';
import { getImageUrl, fileToBase64 } from '@/lib/utils';
import DeleteModal from '@/components/ui/DeleteModal';

interface AddAboutUsProps {
    onSaveRef?: React.MutableRefObject<(() => Promise<void>) | null>;
    onClearRef?: React.MutableRefObject<(() => void) | null>;
}

export const AddAboutUs = ({ onSaveRef, onClearRef }: AddAboutUsProps = {}) => {
    const [openModal, setOpenModal] = useState(false);
    const [aboutData, setAboutData] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [corporateImages, setCorporateImages] = useState<CorporateImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<CorporateImage | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: CorporateImage | null }>({ isOpen: false, item: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (onClearRef) {
            onClearRef.current = () => {
                setAboutData({
                    titleAboutUs: '',
                    aboutUsDescription: '',
                    history: '',
                    mission: '',
                    vision: ''
                });
            };
        }
    }, [onClearRef]);

    // Load existing about us data
    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setIsLoading(true);
                const res = await GetAboutUs();
                if (res?.data) {
                    setAboutData({
                        titleAboutUs: res.data.title || "",
                        aboutUsDescription: res.data.short_description || "",
                        history: res.data.history || "",
                        mission: res.data.mission || "",
                        vision: res.data.vision || ""
                    });
                    if (res.data.corporate_images) {
                        setCorporateImages(res.data.corporate_images);
                    }
                }
            } catch (error) {
                console.error("Error loading about us data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    const aboutDataRef = useRef(aboutData);
    useEffect(() => {
        aboutDataRef.current = aboutData;
    }, [aboutData]);

    const handleSave = React.useCallback(async () => {
        try {
            setIsSaving(true);
            const currentData = aboutDataRef.current;
            await UpdateAboutUs({
                title: currentData.titleAboutUs || "",
                short_description: currentData.aboutUsDescription || "",
                history: currentData.history || "",
                mission: currentData.mission || "",
                vision: currentData.vision || ""
            });
            showToast.success('Información actualizada correctamente');
        } catch (error: any) {
            console.error("Error al guardar la información:", error);
            showToast.error(error?.response?.data?.detail || error?.response?.data?.message || 'Error al guardar la información');
        } finally {
            setIsSaving(false);
        }
    }, []);

    useEffect(() => {
        if (onSaveRef) {
            onSaveRef.current = handleSave;
        }
    }, [onSaveRef, handleSave]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of files) {
                const base64 = await fileToBase64(file);
                await UploadCorporateImage({ file: base64 });
            }
            // Recargar las imágenes
            const res = await GetAboutUs();
            if (res.data.corporate_images) {
                setCorporateImages(res.data.corporate_images);
            }
            showToast.success('Imagen subida correctamente');
        } catch (error: any) {
            showToast.error(error?.response?.data?.detail || error?.response?.data?.message || 'Error al subir la imagen');
        } finally {
            setIsUploading(false);
            // Limpiar el input de archivo
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteImage = (image: CorporateImage) => {
        setDeleteModal({ isOpen: true, item: image });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.item) return;
        setIsDeleting(true);
        const imageId = deleteModal.item.id;
        try {
            await DeleteCorporateImage(imageId);
            setCorporateImages(prev => prev.filter(img => img.id !== imageId));
            showToast.success('Imagen eliminada correctamente');
        } catch (error: any) {
            console.error("Error al eliminar la imagen:", error);
            showToast.error(error?.response?.data?.detail || error?.response?.data?.message || 'Error al eliminar la imagen');
        } finally {
            setIsDeleting(false);
            setDeleteModal({ isOpen: false, item: null });
        }
    };

    const handleViewImage = (image: CorporateImage) => {
        setSelectedImage(image);
        setOpenModal(true);
    };

    const mappedInputs = inputsAboutUsSection.map(input => ({
        ...input,
        value: aboutData[input.id] || "",
        onChange: (val: any) => {
            const value = val?.target ? val.target.value : val;
            setAboutData(prev => ({ ...prev, [input.id]: value }));
        }
    }));

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Información General</h1>
                <p className='text-md text-gray-500'>  Datos principales que describen quiénes somos y nuestra identidad.</p>

                <div className="mt-4">
                    <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                </div>

            </div>

            <div className='flex gap-3'>
                <div className='w-full max-h-max rounded-lg p-5 border'>
                    <div className='flex justify-between items-center mb-1'>
                        <h1 className='font-[500] text-lg'>Imágenes Corporativas</h1>
                        {corporateImages.length > 0 && (
                            <span className='text-sm text-gray-500 font-medium'>
                                {corporateImages.length} {corporateImages.length === 1 ? 'imagen cargada' : 'imágenes cargadas'}
                            </span>
                        )}
                    </div>
                    <p className='text-md text-gray-500'>Fotos a mostrar en la sección de Sobre Nosotros.</p>

                    <div
                        className='bg-white flex items-center justify-center w-full mt-5 rounded-md'
                        onClick={() => fileInputRef.current?.click()}>
                        <div className='flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-md hover:bg-blue-50 hover:border-blue-500 transition-colors cursor-pointer'>
                            {isUploading ? (
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

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            id='dropzone-file-2'
                            type='file'
                            className='hidden'
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            disabled={isUploading}
                        />
                    </div>

                    {corporateImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                            {corporateImages.map((image) => (
                                <div key={image.id} className="group w-full relative aspect-video rounded-lg overflow-hidden border shadow-sm bg-gray-50">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getImageUrl(image.image_url)}
                                        alt="Imagen corporativa"
                                        className="object-contain w-full h-full"
                                    />

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 z-10" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewImage(image);
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
                                            handleDeleteImage(image);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-full shadow z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
                                        title="Eliminar imagen"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-5">Estas imágenes se mostrarán en la sección de &quot;Sobre Nosotros&quot; con el diseño de la página web pública.</p>
                    {openModal && selectedImage && (
                        <>
                            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                            <dialog
                                open
                                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 m-0 w-full h-full max-w-none max-h-none border-none"
                                onClick={() => setOpenModal(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setOpenModal(false);
                                }}
                            >
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                <div 
                                    className="relative w-full max-w-5xl h-full flex items-center justify-center" 
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                >
                                    {/* Botón cerrar */}
                                    <button type='button'
                                        onClick={() => setOpenModal(false)}
                                        className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 shadow z-10 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>

                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getImageUrl(selectedImage.image_url)}
                                        alt="Vista completa"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            </dialog>
                        </>
                    )}

                    <DeleteModal
                        isOpen={deleteModal.isOpen}
                        onClose={() => setDeleteModal({ isOpen: false, item: null })}
                        onConfirm={handleDeleteConfirm}
                        title="Eliminar imagen corporativa"
                        itemName="esta imagen"
                        isDeleting={isDeleting}
                    />
                </div>
            </div>
        </>
    )
}