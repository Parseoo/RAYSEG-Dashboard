'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

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
        <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 overflow-hidden bg-neutral-secondary-medium rounded-full shrink-0">
                <Image
                    className="object-cover"
                    src={preview}
                    alt="Profile picture"
                    fill
                    sizes="40px"
                />
            </div>
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                aria-label="Cambiar foto de perfil"
            >
                <Camera size={16} />
                <span>Cambiar foto</span>
            </button>
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
