'use client';

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface LogoUploadProps {
    onLogoChange?: (file: File, previewUrl: string) => void;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ onLogoChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            onLogoChange?.(file, objectUrl);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary_color text-white w-[180px] h-[36px] rounded-lg flex items-center justify-center gap-2 px-4 hover:opacity-90 transition-opacity font-medium shadow-md text-sm"
                aria-label="Subir logo">
                <Upload size={16} />
                Subir imagen
            </button>
            <p className="text-xs text-gray-500">
                JPG, PNG o SVG, máximo 2 MB
            </p>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/svg+xml,image/*"
                onChange={handleFileChange}
            />
        </div>
    );
};
