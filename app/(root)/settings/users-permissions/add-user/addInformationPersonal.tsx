import { DynamicInputs } from "@/components/ui/Input"
import { inputsUserPermissions } from "../../inputConfig"
import { ProfileImageUpload } from "@/components/ui/ProfileImageUpload"
import { UserForm } from "@/lib/@type"

interface AddInformationPersonalProps {
    user: UserForm;
    setUser: React.Dispatch<React.SetStateAction<UserForm>>;
    errors: Partial<UserForm>;
}

export const AddInformationPersonal = ({ user, setUser, errors }: AddInformationPersonalProps) => {

    const inputsWithState = inputsUserPermissions.map(input => ({
        ...input,
        value: user[input.id as keyof UserForm] as string | boolean,
        onChange: (e: any) => {
            const value = e.target ? e.target.value : e;

            let finalValue = value;
            if (input.id === 'is_active') {
                // Conversión robusta a booleano
                finalValue = value === 'true' || value === true;
                console.log(`[AddInformationPersonal] Cambiando is_active: original='${value}', final=${finalValue}`);
            }

            setUser(prev => ({ ...prev, [input.id]: finalValue }));
        },
        error: errors[input.id as keyof UserForm] as string | undefined
    }));

    return (
        <>
            <div className='bg-white w-full max-h-max rounded-lg'>
                <div className='w-full h-full'>
                    <div className='flex gap-3'>
                        <div className='w-full max-h-max rounded-lg p-5 mb-5 border'>
                            <h1 className='font-[500] text-lg'>Información personal</h1>
                            <p className='text-md text-gray-500'>Identificación principal del cliente y tipo de relación.</p>

                            <div className='mt-6 mb-4'>
                                <ProfileImageUpload onImageChange={(file) => console.log(file)} />
                            </div>

                            <div className='mt-4'>
                                <DynamicInputs inputs={inputsWithState} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}