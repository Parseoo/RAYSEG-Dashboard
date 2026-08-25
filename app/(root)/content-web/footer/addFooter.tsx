"use client"

import { DynamicInputs } from '@/components/ui/Input';
import { inputsFooterSection, inputsSocialMedia, inputsTextFooter } from '../inputConfig';

interface AddFooterProps {
    settings: any;
    onChange: (id: string, value: any) => void;
}

export const AddFooter = ({ settings, onChange }: AddFooterProps) => {
    const mapInputs = (inputs: any[]) => inputs.map(input => ({
        ...input,
        value: settings[input.id] || '',
        onChange: (e: any) => {
            const val = e?.target ? e.target.value : e;
            onChange(input.id, val);
        }
    }));

    return (
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Información de Contacto</h1>
                <p className='text-md text-gray-500'>Información como teléfono, correo y dirección que aparecerá en el sitio web.</p>

                <div className="mt-4">
                    <DynamicInputs inputs={mapInputs(inputsFooterSection)} withBgWhite={true} />
                </div>
            </div>
            <div className='flex gap-3'>
                <div className='w-full max-h-max rounded-lg p-5 border'>
                    <h1 className='font-[500] text-lg'>Redes Sociales</h1>
                    <p className='text-md text-gray-500'>Enlaces sociales que se mostrarán en el sitio web.</p>

                    <div className="mt-4">
                        <DynamicInputs inputs={mapInputs(inputsSocialMedia)} withBgWhite={true} />
                    </div>
                    <p className="text-sm text-gray-500 mt-5">Este número se usará para el botón flotante de WhatsApp en la web.</p>
                    <p className='text-sm text-gray-500 mt-1'>Las redes sociales son opcionales. Solo los campos que completes se mostrarán en la web.</p>
                </div>
            </div>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Texto de pie de página (footer)</h1>
                <p className="text-sm font-normal text-gray-600 mt-1">Texto informativo o descriptivo que se mostrará en la parte inferior del sitio web.</p>

                    <div className="mt-4">
                        <DynamicInputs inputs={mapInputs(inputsTextFooter)} withBgWhite={true} />
                    </div>
                    <p className="text-sm text-gray-500 mt-5">Este texto aparecerá en el footer de la web sobre los datos de contacto.</p>
            </div>
        </>
    )
}