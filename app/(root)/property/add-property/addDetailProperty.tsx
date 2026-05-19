"use client"

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { DynamicInputs, InputFieldConfig } from '@/components/ui/Input';
import { ItemResponse } from '@/lib/@type';

// Configuración de los inputs
const inputs: InputFieldConfig[] = [
    { type: 'text', id: 'terrain_size', label: 'Superficie Terreno (m²)', placeholder: 'Ej: 100', group: 1 },
    { type: 'text', id: 'construction_size', label: 'Superficie Const. (m²)', placeholder: 'Ej: 80', group: 1 },
    { type: 'text', id: 'rooms', label: 'Recámaras / Habitaciones', placeholder: 'Ej: 3', group: 2 },
    { type: 'text', id: 'bathrooms', label: 'Baños', placeholder: 'Ej: 2', group: 2 },
    { type: 'text', id: 'parking_spaces', label: 'Cocheras', placeholder: 'Ej: 1', group: 2 },
    { type: 'text', id: 'floors', label: 'Pisos', placeholder: 'Ej: 1', group: 3 },
    { type: 'text', id: 'construction_year', label: 'Año de construcción', placeholder: 'Ej: 2020', group: 3 },
    { type: 'text', id: 'terrain_type', label: 'Tipo de terreno', placeholder: 'Ej: Regular', group: 4 },
    { type: 'select', id: 'conservation_status', label: 'Estado de conservación', placeholder: 'Seleccionar', group: 4, options: [
        { label: 'Excelente', value: 'excellent' },
        { label: 'Bueno', value: 'good' },
        { label: 'A remodelar', value: 'to_remodel' }
    ] },
];

import { useProperty } from '../propertyContext';

// Componente de Select Múltiple
const MultiSelect = ({
    options,
    selectedValues,
    onChange,
    placeholder = 'Seleccionar opciones...',
    label
}: {
    options: { value: string; label: string; description?: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    label?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [customInput, setCustomInput] = useState('');
    const [combinedOptions, setCombinedOptions] = useState(options);

    useEffect(() => {
        setCombinedOptions(options);
    }, [options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const removeOption = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selectedValues.filter(v => v !== value));
    };

    const selectedOptions = combinedOptions.filter(opt => selectedValues.includes(opt.value));

    // Añadir opción personalizada desde el input
    const addCustomOption = () => {
        const label = customInput.trim();
        if (!label) return;
        const value = `custom-${Date.now()}`;
        const newOpt = { value, label };
        setCombinedOptions(prev => [newOpt, ...prev]);
        onChange([...selectedValues, value]);
        setCustomInput('');
        setIsOpen(false);
    };

    return (
        <div className='flex flex-col gap-2'>
            {label && (
                <label className='text-sm font-medium text-gray-700'>
                    {label}
                </label>
            )}
            <div className='relative' ref={dropdownRef}>
                <button
                    type='button'
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full min-h-[42px] px-4 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''
                        }`}
                >
                    <div className='flex flex-wrap gap-2 flex-1'>
                        {selectedOptions.length > 0 ? (
                            selectedOptions.map((option) => (
                                <span
                                    key={option.value}
                                    className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200'
                                >
                                    {option.label}
                                    <button
                                        type='button'
                                        onClick={(e) => removeOption(option.value, e)}
                                        className='hover:bg-blue-100 rounded-full p-0.5 transition-colors'
                                    >
                                        <X size={12} className='text-blue-700' />
                                    </button>
                                </span>
                            ))
                        ) : (
                            <span className='text-gray-500'>{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto'>
                        <div className='p-2 space-y-1'>
                            <div className='px-2 pb-2'>
                                <div className='flex gap-2'>
                                    <input
                                        type='text'
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomOption(); } }}
                                        placeholder='Agregar opción y presiona Enter...'
                                        className='flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none'
                                    />
                                    <button
                                        type='button'
                                        onClick={addCustomOption}
                                        className='px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700'
                                    >Agregar</button>
                                </div>
                            </div>
                            {combinedOptions.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() => toggleOption(option.value)}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-gray-50 text-gray-800'
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${isSelected
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-300'
                                            }`}>
                                            {isSelected && <Check size={12} className='text-white' />}
                                        </div>
                                        <div className='flex-1'>
                                            <div className='text-sm font-medium'>{option.label}</div>
                                            {option.description && (
                                                <div className='text-xs text-gray-500'>{option.description}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AddDetailProperty = () => {
    const { state, updateField, amenitiesCatalog } = useProperty();
    
    const mappedInputs = inputs.map(input => ({
        ...input,
        value: state[input.id as keyof typeof state] as any,
        onChange: (e: any) => updateField(input.id as any, typeof e === 'string' ? e : e.target.value)
    }));

    // Convertir el catálogo de amenidades al formato del MultiSelect
    const dynamicAmenities = (amenitiesCatalog || []).map((item: ItemResponse) => ({
        value: String(item.catalogItemID),
        label: item.name,
        description: item.description
    }));

    return (
        <div className='bg-white w-full max-h-max rounded-lg'>
            <div className='w-full h-full'>
                <div className='flex gap-3'>
                    <div className='w-full max-h-max rounded-lg p-5 mb-9 border'>
                        <h1 className='font-[500] text-lg'>Caracteristicas</h1>
                        <p className='text-md text-gray-500'>Caracteristicas físicas y comodidades.</p>
                        <div className='mt-4 flex flex-col gap-4'>
                            <DynamicInputs inputs={mappedInputs} withBgWhite={true} />
                            <MultiSelect
                                label='Amenidades'
                                options={dynamicAmenities}
                                selectedValues={state.amenities}
                                onChange={(vals) => updateField('amenities', vals)}
                                placeholder='Seleccionar amenidades...'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDetailProperty;