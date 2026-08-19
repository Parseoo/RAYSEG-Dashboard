"use client"

import React, { useEffect } from 'react';
import { X, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';

interface ItemDetail {
    label: string;
    value: string;
}

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    itemName?: string;
    itemDetails?: ItemDetail[];
    isDeleting?: boolean;
    variant?: 'delete' | 'warning';
    message?: string;
    warningText?: string;
    customDeletePhrase?: string;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName,
    itemDetails = [],
    isDeleting = false,
    variant = 'delete',
    message,
    warningText,
    customDeletePhrase,
}: Readonly<DeleteModalProps>) {
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

    const isWarning = variant === 'warning';

    return (
        <>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <dialog
                open
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 m-0 max-w-none max-h-none h-full w-full"
                style={{ animation: 'fadeIn 0.2s ease-out' }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') onClose();
                }}
            >
                <div
                    className="bg-white rounded-[5px] shadow-2xl max-w-lg w-full"
                    style={{ animation: 'scaleIn 0.2s ease-out' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isWarning ? 'bg-yellow-100' : 'bg-red-100'}`}>
                                {isWarning
                                    ? <AlertCircle className="w-5 h-5 text-yellow-600" />
                                    : <AlertTriangle className="w-5 h-5 text-red-600" />
                                }
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        </div>
                        <button type='button'
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                        {message && (
                            <p className="text-gray-700 leading-relaxed">{message}</p>
                        )}
                        {warningText && (
                            <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">{warningText}</p>
                        )}
                        {!isWarning && itemName && (
                            <>
                                <p className="text-gray-700">
                                    {customDeletePhrase
                                        ? <>¿Estás seguro de que deseas {customDeletePhrase} <span className="font-semibold text-gray-900">{itemName}</span>? Esta acción no se puede deshacer.</>
                                        : <>¿Estás seguro de que deseas eliminar a <span className="font-semibold text-gray-900">{itemName}</span>? Esta acción no se puede deshacer.</>
                                    }
                                </p>
                                {itemDetails.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 border border-gray-200">
                                        {itemDetails.map((detail) => (
                                            <div key={detail.label} className="flex justify-between text-sm gap-2">
                                                <span className="text-gray-500 shrink-0">{detail.label}:</span>
                                                <span className="font-medium text-gray-800 text-right break-words">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4 flex gap-3">
                        {onConfirm && !isWarning && (
                            <button type='button'
                                onClick={onConfirm}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-[5px] hover:bg-red-600 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                            >
                                {isDeleting
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Eliminando...</>
                                    : 'Sí, eliminar'
                                }
                            </button>
                        )}
                        {isWarning && (
                            <button type='button'
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-primary_color text-white rounded-[5px] hover:opacity-90 transition-all font-medium text-sm shadow-md"
                            >
                                Entendido
                            </button>
                        )}
                        <button type='button'
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-slate-100 text-gray-700 rounded-[5px] hover:bg-slate-200 transition-all font-medium disabled:opacity-50 text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </dialog>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </>
    );
}
