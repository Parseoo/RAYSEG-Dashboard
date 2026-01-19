"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="flex items-center gap-2 cursor-pointer group">
                <input
                    type="checkbox"
                    className={cn(
                        "peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-blue-600 checked:border-blue-600 transition-all",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {label && (
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";
