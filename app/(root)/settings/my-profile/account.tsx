"use client"

import { DynamicInputs } from "@/components/ui/Input"
import { inputsAccount } from "../inputConfig"
import { UserResponse } from "@/lib/@type"

interface AccountSettingsProps {
    user?: UserResponse | null;
}

export const AccountSettings = ({ user }: AccountSettingsProps) => {
    const memberSinceDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';
}

export default AccountSettings;