import { DynamicInputs } from '@/components/ui/Input';
import{ inputsAddEmployment } from '@/app/(root)/agents/add-agent/inputs.data';
import { Switch } from '@/components/ui/Switch';
import { useState } from 'react';

export const AddPreferencesAgent = () => {
    const [isActive, setIsActive] = useState(true);

    const filteredInputs = inputsAddEmployment.filter(input => input.id !== 'estatus');

    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Datos Laborales</h1>
                            <p className='text-md text-gray-500'>Registro de la información laboral y operativa del agente.</p>
                            <div className='mt-4'>
                                <DynamicInputs inputs={filteredInputs} withBgWhite={true} />
                            </div>
                            <div className='mt-4'>
                                <div className='flex items-center gap-3'>
                                    <Switch
                                        checked={isActive}
                                        onLabel="Activo"
                                        offLabel="Inactivo"
                                        onChange={(e: any) => {
                                            const checked = typeof e === 'boolean' ? e : e.target.checked;
                                            setIsActive(checked);
                                        }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Estatus del agente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddPreferencesAgent