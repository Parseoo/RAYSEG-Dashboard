"use client"

import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export default function WarningModal({
    isOpen,
    onClose,
    title,
    message
}: WarningModalProps) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <p className="text-gray-700 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-5 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-primary_color text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-md"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
        </>
    );
}
