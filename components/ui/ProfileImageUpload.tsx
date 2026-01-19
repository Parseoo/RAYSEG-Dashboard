'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface ProfileImageUploadProps {
    currentImage?: string;
    onImageChange?: (file: File) => void;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    currentImage = "/docs/images/people/profile-picture-5.jpg",
    onImageChange
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(currentImage);

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
            <div className="relative w-24 h-24 overflow-hidden bg-neutral-secondary-medium rounded-full shrink-0">
                <Image
                    className="object-cover"
                    src={preview}
                    alt="Profile picture"
                    fill
                    sizes="96px"
                />
            </div>

            {/* Button and Help Text */}
            <div className="flex flex-col gap-1 mt-5">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary_color text-white w-[270px] h-[30px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium"
                    aria-label="Cambiar foto de perfil">
                    Agregar foto
                </button>
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
