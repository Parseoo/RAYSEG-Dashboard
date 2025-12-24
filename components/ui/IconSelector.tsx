"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

// List of icons to show in the selector
export const AVAILABLE_ICONS: (keyof typeof LucideIcons)[] = [
    "Home", "Key", "Building", "Building2", "Landmark", "MapPin",
    "User", "Users", "Phone", "Mail", "Search", "Heart",
    "Star", "Check", "CheckCircle", "CirclePlus", "Plus",
    "Shield", "Gavel", "Zap", "Hammer", "Truck", "Briefcase",
    "Calendar", "DollarSign", "Wallet", "Handshake", "Scaling",
    "Pencil", "FileText", "LayoutDashboard", "Layers"
];

interface IconSelectorProps {
    onSelect: (iconName: keyof typeof LucideIcons) => void;
    selectedIcon?: keyof typeof LucideIcons;
    onClose: () => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ onSelect, selectedIcon, onClose }) => {
    return (
        <div className="absolute top-full left-0 mt-2 z-[100] bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-[280px]">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700">Seleccionar Icono</span>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <LucideIcons.X size={16} />
                </button>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {AVAILABLE_ICONS.map((iconName) => {
                    const IconComponent = LucideIcons[iconName] as LucideIcon;
                    const isSelected = selectedIcon === iconName;

                    return (
                        <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                                onSelect(iconName);
                                onClose();
                            }}
                            className={`p-2 flex items-center justify-center rounded-md border transition-all hover:border-blue-500 hover:bg-blue-50 ${isSelected ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-500"
                                }`}
                            title={iconName}
                        >
                            <IconComponent size={20} />
                        </button>
                    );
                })}
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #aaa;
                }
            `}</style>
        </div>
    );
};

export default IconSelector;
