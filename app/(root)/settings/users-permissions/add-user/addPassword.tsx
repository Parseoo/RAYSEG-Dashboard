"use client"

import { DynamicInputs } from '@/components/ui/Input'
import { inputsPassword } from '../../inputConfig'
import { Checkbox } from '@/components/ui/Checkbox'
import { UserForm } from '@/lib/@type'

interface AddPasswordProps {
    user: UserForm;
    setUser: React.Dispatch<React.SetStateAction<UserForm>>;
    errors: Partial<UserForm>;
}

export const AddPassword = ({ user, setUser, errors }: AddPasswordProps) => {

    const inputsWithState = inputsPassword.map(input => ({
        ...input,
        value: user[input.id as keyof UserForm] as string,
        onChange: (e: any) => {
            const value = e.target ? e.target.value : e;
            setUser(prev => ({ ...prev, [input.id]: value }));
        },
        error: errors[input.id as keyof UserForm] as string | undefined
    }));

    return (
        <div className='w-full max-h-max rounded-xl p-4 sm:p-6 border border-slate-200 bg-white shadow-sm'>
            <h2 className='font-semibold text-lg text-gray-900'>Seguridad de la cuenta</h2>
            <p className='text-sm text-gray-500 mt-0.5'>Establece o actualiza la contraseña de acceso a la plataforma.</p>

            <div className="mt-5">
                <DynamicInputs inputs={inputsWithState} withBgWhite={true} />
            </div>
        </div>
    )
}

export default AddPassword
