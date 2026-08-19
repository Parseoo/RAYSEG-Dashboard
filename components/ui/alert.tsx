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
            container: "bg-green-50 border-green-200",
            icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
            title: "text-green-800",
            content: "text-green-700",
            closeButton: "hover:bg-green-100 text-green-600"
        },
        error: {
            container: "bg-red-50 border-red-200",
            icon: <AlertCircle className="w-5 h-5 text-red-600" />,
            title: "text-red-800",
            content: "text-red-700",
            closeButton: "hover:bg-red-100 text-red-600"
        },
        warning: {
            container: "bg-amber-50 border-amber-200",
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
            title: "text-amber-800",
            content: "text-amber-700",
            closeButton: "hover:bg-amber-100 text-amber-600"
        },
        info: {
            container: "bg-blue-50 border-blue-200",
            icon: <Info className="w-5 h-5 text-blue-600" />,
            title: "text-blue-800",
            content: "text-blue-700",
            closeButton: "hover:bg-blue-100 text-blue-600"
        }
    };

    const config = configs[variant];

    return (
        <div className={`p-4 rounded-lg border flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${config.container}`}>
            <div className="flex-shrink-0 mt-0.5">
                {config.icon}
            </div>
            <div className="flex-1">
                {title && (
                    <h3 className={`text-sm font-bold mb-1 ${config.title}`}>
                        {title}
                    </h3>
                )}
                <div className={`text-sm leading-relaxed ${config.content}`}>
                    {children}
                </div>
            </div>
            {onClose && (
                <button type="button"
                    onClick={onClose}
                    className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${config.closeButton}`}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
