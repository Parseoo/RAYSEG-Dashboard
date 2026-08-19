"use client"

import { UserResponse } from "@/lib/@type"

interface AccountSettingsProps {
    user?: UserResponse | null;
}

export const AccountSettings = ({ user }: AccountSettingsProps) => {
}

export default AccountSettings;