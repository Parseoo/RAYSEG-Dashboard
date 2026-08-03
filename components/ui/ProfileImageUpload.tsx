'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Pencil, User } from 'lucide-react';
import { getUserImageUrl } from '@/lib/utils';

interface ProfileImageUploadProps {
    currentImage?: string;
    onImageChange?: (file: File) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    currentImage = "",
    onImageChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>(() => {
        return currentImage ? getUserImageUrl(currentImage) : "";
    });

    useEffect(() => {
        if (currentImage) {
            setPreview(getUserImageUrl(currentImage));
        } else {
            setPreview("");
        }
    }, [currentImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageChange?.(file);
        }
    };

    return (
        <div className="flex items-start gap-4">
            {/* Circle Avatar */}
            <div className="relative group shrink-0">
                <div className="relative w-24 h-24 overflow-hidden bg-neutral-secondary-medium rounded-full">
                    {preview ? (
                        <Image
                            className="object-cover"
                            src={preview}
                            alt="Profile picture"
                            fill
                            sizes="96px"
                            unoptimized={true}
                            onError={() => setPreview("")}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <User size={48} className="text-gray-400" />
                        </div>
                    )}
                </div>
                {preview && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border hover:bg-gray-50 transition-colors"
                        aria-label="Cambiar foto de perfil"
                    >
                        <Pencil size={14} className="text-gray-600" />
                    </button>
                )}
            </div>

            {/* Button and Help Text */}
            <div className="flex flex-col gap-1 mt-5">
                {!preview && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-primary_color text-white w-[270px] h-[30px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md"
                        aria-label="Agregar foto de perfil">
                        Agregar foto
                    </button>
                )}
                <p className="text-sm text-gray-500 mt-2">
                    Recomendado: 400x400px, JPG o PNG, máximo 2 MB.
                </p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
};
