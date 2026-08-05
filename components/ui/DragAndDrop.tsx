"use client";

import { GripVertical, House, MoreVertical, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export type Item = {
    id: string;
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
};


interface DragAndDropProps {
    items?: Item[];
    onChange?: (items: Item[]) => void;
    onDelete?: (item: Item) => void;
    onEdit?: (item: Item) => void;
    className?: string;
}

const defaultItems: Item[] = [
    {
        id: "rentals",
        icon: House,
        title: "Renta y Venta de Propiedades",
        description: "Ofrecemos una amplia gama de propiedades en renta y venta, desde apartamentos hasta casas familiares.",
    },
];

// Componente de menú de 3 puntos para mobile
function KebabMenu({ item, onEdit, onDelete }: { item: Item; onEdit?: (item: Item) => void; onDelete?: (item: Item) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Opciones"
            >
                <MoreVertical size={18} className="text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(item);
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Pencil size={15} className="text-gray-500" />
                        Editar
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(item);
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={15} className="text-red-500" />
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ items = defaultItems, onChange, onDelete, onEdit, className }) => {
    const [list, setList] = useState<Item[]>(items);
    const containerRef = useRef<HTMLUListElement | null>(null);
    const sortableRef = useRef<any>(null);

    useEffect(() => setList(items), [items]);

    useEffect(() => {
        if (!containerRef.current) return;

        let isMounted = true;
        let Sortable: any;

        (async () => {
            const mod = await import("sortablejs");
            Sortable = mod && mod.default ? mod.default : mod;

            if (!isMounted || !containerRef.current) return;

            const instance = Sortable.create(containerRef.current, {
                animation: 150,
                handle: ".handle",
                dataIdAttr: "data-id",
                onEnd: (evt: any) => {
                    setList((prev) => {
                        const updated = [...prev];
                        const from = typeof evt.oldIndex === "number" ? evt.oldIndex : 0;
                        const to = typeof evt.newIndex === "number" ? evt.newIndex : from;
                        const [moved] = updated.splice(from, 1);
                        updated.splice(to, 0, moved);
                        onChange?.(updated);
                        return updated;
                    });
                },
            });

            sortableRef.current = instance;
        })();

        return () => {
            isMounted = false;
            if (sortableRef.current && typeof sortableRef.current.destroy === "function") {
                sortableRef.current.destroy();
                sortableRef.current = null;
            }
        };
    }, [onChange]);

    return (
        <div>
            {/* Vista Mobile: Cards con menú de 3 puntos */}
            <div className={`grid grid-cols-1 gap-3 md:hidden ${className ?? ""}`}>
                {list.map((item) => {
                    const Icon = item.icon as any;
                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="bg-blue-50 p-2.5 rounded-lg shrink-0">
                                        {Icon ? <Icon size={20} className="text-blue-500" /> : <House size={20} className="text-blue-500" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                                <KebabMenu item={item} onEdit={onEdit} onDelete={onDelete} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Vista Desktop: Lista Drag & Drop original */}
            <ul ref={containerRef} id="hs-basic-usage-example-sortable" className={`w-full flex-col hidden md:flex ${className ?? ""}`}>
                {list.map((item) => {
                    const Icon = item.icon as any;
                    return (
                        <li key={item.id} data-id={item.id}
                            className="flex items-center gap-x-3 py-3 px-4 cursor-grab text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                            <span className="handle shrink-0">
                                <GripVertical size={16} className="text-gray-500" />
                            </span>
                            <a href="#" className="bg-blue-50 block p-2 rounded-sm shadow-xs hover:bg-neutral-secondary-medium shrink-0">
                                {Icon ? <Icon size={16} className="hover: text-blue-500" /> : <House size={16} className="text-blue-500" />}
                            </a>
                            <div className="ms-2 flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{item.title}</div>
                                {item.description ? <p className="text-xs text-gray-500 truncate">{item.description}</p> : null}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => onEdit?.(item)}
                                    className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
                                    <Pencil size={16} className='text-gray-600' />
                                </button>
                                <button
                                    onClick={() => onDelete?.(item)}
                                    className='p-1.5 bg-red-500 rounded-md transition-colors hover:bg-red-600'>
                                    <Trash2 size={16} className='text-white' />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DragAndDrop;