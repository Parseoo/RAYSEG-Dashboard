"use client";

import React from "react";
import {
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Info,
    X
} from "lucide-react";

interface AlertProps {
    variant?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    children: React.ReactNode;
    onClose?: () => void;
}

export const Alert = ({
    variant = 'info',
    title,
    children,
    onClose
}: AlertProps) => {
    const configs = {
        success: {
            borderLeft: "border-green-500",
            icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
            title: "text-gray-900",
            content: "text-gray-600",
            closeButton: "hover:bg-gray-100 text-gray-500"
        },
        error: {
            borderLeft: "border-red-500",
            icon: <AlertCircle className="w-8 h-8 text-red-500" />,
            title: "text-gray-900",
            content: "text-gray-600",
            closeButton: "hover:bg-gray-100 text-gray-500"
        },
        warning: {
            borderLeft: "border-amber-500",
            icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
            title: "text-gray-900",
            content: "text-gray-600",
            closeButton: "hover:bg-gray-100 text-gray-500"
        },
        info: {
            borderLeft: "border-blue-500",
            icon: <Info className="w-8 h-8 text-blue-500" />,
            title: "text-gray-900",
            content: "text-gray-600",
            closeButton: "hover:bg-gray-100 text-gray-500"
        }
    };

    const config = configs[variant];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className={`w-full max-w-md bg-white rounded-xl shadow-2xl border-l-4 p-6 relative flex flex-col gap-4 animate-in zoom-in-95 duration-200 ${config.borderLeft}`}>
                {onClose && (
                    <button type="button"
                        onClick={onClose}
                        className={`absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${config.closeButton}`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {config.icon}
                    </div>
                    <div className="flex-1">
                        {title && (
                            <h3 className={`text-lg font-bold mb-1 ${config.title}`}>
                                {title}
                            </h3>
                        )}
                        <div className={`text-sm leading-relaxed ${config.content}`}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
