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
        <>
            <div className='w-full max-h-max rounded-lg p-5 border'>
                <h1 className='font-[500] text-lg'>Seguridad de la cuenta</h1>
                <p className='text-md text-gray-500'>Gestiona la contraseña. Otros cambios se hacen por administración</p>

                <div className="mt-4">
                    <DynamicInputs inputs={inputsWithState} withBgWhite={true} />
                </div>
                {/*<div className="flex items-center gap-2 mt-3">
                    <Checkbox className="w-4 h-4" />
                    <p className="text-gray-500">
                        Envia por correo eléctrónico usuario y contraseña.
                    </p>
                </div>*/}
            </div>
        </>

    )
}

export default AddPassword
