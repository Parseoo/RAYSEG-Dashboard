"use client";

import { GripVertical, House, Pencil, Trash2 } from "lucide-react";
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

const DragAndDrop: React.FC<DragAndDropProps> = ({ items = defaultItems, onChange, className }) => {
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
            <ul ref={containerRef} id="hs-basic-usage-example-sortable" className={`w-full flex flex-col ${className ?? ""}`}>
                {list.map((item) => {
                    const Icon = item.icon as any;
                    return (
                        <li key={item.id} data-id={item.id}
                            className="flex items-center gap-x-3 py-3 px-4 cursor-grab text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
                            <span className="handle">
                                <GripVertical size={16} className="text-gray-500" />
                            </span>
                            <a href="#" className="bg-blue-50 block max-w-sm p-2 rounded-sm shadow-xs hover:bg-neutral-secondary-medium">
                                {Icon ? <Icon size={16} className="hover: text-blue-500" /> : <House size={16} className="text-blue-500" />}
                            </a>
                            <div className="ms-2 flex-1">
                                <div className="text-sm font-medium">{item.title}</div>
                                {item.description ? <p className="text-xs text-gray-500">{item.description}</p> : null}
                            </div>
                            <button className='p-1.5 bg-slate-200 rounded-md transition-colors hover:bg-slate-300'>
                                <Pencil size={16} className='text-gray-600' />
                            </button>
                            <button className='p-1.5 bg-red-500 rounded-md transition-colors hover:bg-red-600'>
                                <Trash2 size={16} className='text-white' />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DragAndDrop;