'use client'
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from './select';

interface SearchItem {
    title: string,
    width?: string,
    type?: string,
    id?: string,
    required?: boolean,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export type InputFieldConfig = {
    type: 'text' | 'select' | 'url' | 'email' | 'number' | 'tel' | 'textarea' | 'checkbox' | 'date';
    id: string;
    label: string;
    placeholder?: string;
    className?: string;
    group?: string | number;
    options?: { label: string; value: string }[];
    required?: boolean;
    rows?: number;
};

interface InputFieldProps {
    input: InputFieldConfig;
    withBgWhite?: boolean;
}

interface DynamicInputsProps {
    inputs: InputFieldConfig[];
    withBgWhite?: boolean;
}

// Componente para renderizar un input individual
export const InputField = React.memo(({ input, withBgWhite = false }: InputFieldProps) => {
    const bgClass = withBgWhite ? 'bg-white' : '';

    return (
        <div className='flex flex-col gap-2 flex-1'>
            <label htmlFor={input.id} className='text-sm font-medium text-gray-700'>
                {input.label}
                {input.required && <span className='text-red-500 ml-1'>*</span>}
            </label>

            {input.type === 'select' ? (
                <Select>
                    <SelectTrigger className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all ${bgClass} ${input.className || ''}`} id={input.id}>
                        <SelectValue placeholder={input.placeholder || 'Seleccionar...'} />
                    </SelectTrigger>
                    <SelectContent>
                        {input.options?.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className={bgClass}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : input.type === 'textarea' ? (
                <textarea
                    id={input.id}
                    placeholder={input.placeholder}
                    required={input.required}
                    rows={input.rows}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] resize-y ${bgClass} ${input.className || ''}`}
                />
            ) : (
                <input
                    type={input.type}
                    id={input.id}
                    placeholder={input.placeholder}
                    required={input.required}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all ${bgClass} ${input.className || ''}`}
                />
            )}
        </div>
    );
});

InputField.displayName = 'InputField';

// Componente para renderizar inputs dinámicamente agrupados
export const DynamicInputs = React.memo(({ inputs, withBgWhite = false }: DynamicInputsProps) => {
    const renderInputs = useMemo(() => {
        const result: React.ReactNode[] = [];
        const processedIndices = new Set<number>();

        for (let i = 0; i < inputs.length; i++) {
            if (processedIndices.has(i)) {
                continue;
            }

            const currentInput = inputs[i];

            if (currentInput.group !== undefined) {
                const groupInputs: InputFieldConfig[] = [currentInput];
                processedIndices.add(i);

                let j = i + 1;
                while (j < inputs.length && inputs[j]?.group === currentInput.group) {
                    groupInputs.push(inputs[j]);
                    processedIndices.add(j);
                    j++;
                }

                result.push(
                    <div key={`group-${currentInput.group}-${i}`} className='flex gap-4'>
                        {groupInputs.map((groupInput) => (
                            <InputField key={groupInput.id} input={groupInput} withBgWhite={withBgWhite} />
                        ))}
                    </div>
                );
            } else {
                result.push(
                    <InputField key={currentInput.id} input={currentInput} withBgWhite={withBgWhite} />
                );
                processedIndices.add(i);
            }
        }

        return result;
    }, [inputs, withBgWhite]);

    return <div className='flex flex-col gap-4'>{renderInputs}</div>;
});

DynamicInputs.displayName = 'DynamicInputs';

export const Input: React.FC<SearchItem> = ({ title, width, type, id, required, value, onChange }) => {
    return (
        <div className='w-full relative flex-grow block lg:block'>
            <input
                required={required}
                id={id}
                type={type || 'text'}
                placeholder={title}
                value={value}
                onChange={onChange} // добавляем обработчик изменений
                className={cn(
                    width ? `pl-5 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500 hover:outline-none w-${width}`
                        : `w-full pl-5 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500 hover:outline-none`
                )}
            />
        </div>
    );
}