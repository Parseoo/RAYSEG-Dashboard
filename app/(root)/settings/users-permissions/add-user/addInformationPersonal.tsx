"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsUserPermissions } from "../../inputConfig"
import { ProfileImageUpload } from "@/components/ui/ProfileImageUpload"

export const AddInformationPersonal = () => {
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
                                <DynamicInputs inputs={inputsUserPermissions} withBgWhite={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}