import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from './select';
import { Eye, EyeOff } from 'lucide-react';

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
    type: 'text' | 'select' | 'url' | 'email' | 'number' | 'tel' | 'textarea' | 'checkbox' | 'date' | 'password';
    id: string;
    label?: string;
    placeholder?: string;
    className?: string;
    group?: string | number;
    options?: { label: string; value: string | boolean }[];
    required?: boolean;
    rows?: number;
    icon?: React.ElementType;
    iconLayout?: 'default' | 'inline';
    value?: string | number | boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => void;
    error?: string;
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
    const Icon = input.icon;
    const isInlineIcon = input.iconLayout === 'inline';
    const errorClass = input.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500';
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = input.type === 'password';

    const renderInput = () => (
        <div className="relative">
            {input.type === 'select' ? (
                <Select 
                    value={String(input.value)} 
                    onValueChange={(val) => input.onChange && input.onChange(val)}
                >
                    <SelectTrigger className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${bgClass} ${errorClass} ${input.className || ''}`} id={input.id}>
                        <SelectValue placeholder={input.placeholder || 'Seleccionar...'} />
                    </SelectTrigger>
                    <SelectContent>
                        {input.options?.map(opt => (
                            <SelectItem key={String(opt.value)} value={String(opt.value)} className={bgClass}>
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
                    value={input.value as string | number | readonly string[] | undefined}
                    onChange={input.onChange as any}
                    className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all min-h-[100px] resize-y ${bgClass} ${errorClass} ${input.className || ''}`}
                />
            ) : (
                <div className="relative flex items-center">
                    <input
                        type={isPasswordType ? (showPassword ? 'text' : 'password') : input.type}
                        id={input.id}
                        placeholder={input.placeholder}
                        required={input.required}
                        value={input.value as string | number | readonly string[] | undefined}
                        onChange={input.onChange as any}
                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 transition-all ${bgClass} ${errorClass} ${input.className || ''} ${isPasswordType ? 'pr-10' : ''}`}
                    />
                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
            )}
            {input.error && <p className="text-xs text-red-500 mt-1">{input.error}</p>}
        </div>
    );

    return (
        <div className='flex flex-col gap-2 flex-1'>
            {Icon && !isInlineIcon ? (
                <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-md shadow-sm mt-1">
                        <Icon size={20} />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label htmlFor={input.id} className='text-sm font-medium text-gray-700'>
                            {input.label}
                            {input.required && <span className='text-red-500 ml-1'>*</span>}
                        </label>
                        {renderInput()}
                    </div>
                </div>
            ) : (
                <>
                    <label htmlFor={input.id} className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                        {input.label}
                        {isInlineIcon && Icon && <Icon size={18} className="text-blue-500" />}
                        {input.required && <span className='text-red-500 ml-1'>*</span>}
                    </label>
                    {renderInput()}
                </>
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
                onChange={onChange}
                className={cn(
                    width ? `pl-5 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500 hover:outline-none w-${width}`
                        : `w-full pl-5 pr-4 py-2 rounded-lg outline-none bg-gray-100 transition-all hover:ring-2 hover:ring-blue-500 hover:outline-none`
                )}
            />
        </div>
    );
}