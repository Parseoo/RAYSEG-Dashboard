"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    onLabel?: string;
    offLabel?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, label, onLabel = "Habilitado", offLabel = "Deshabilitado", ...props }, ref) => {
        return (
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        ref={ref}
                        {...props}
                    />
                    <div className={cn(
                        "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600",
                        className
                    )}></div>
                </div>
                {(label || onLabel || offLabel) && (
                    <span className="text-sm font-medium text-gray-500">
                        {props.checked ? onLabel : offLabel}
                        {label && ` ${label}`}
                    </span>
                )}
            </label>
        );
    }
);

Switch.displayName = "Switch";
