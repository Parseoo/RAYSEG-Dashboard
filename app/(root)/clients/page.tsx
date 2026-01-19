import React from 'react';
import ClientsList from '@/app/(root)/clients/ClientsList';

const ClientsPage = () => {
    return (
        <div>
            <ClientsList data={[]} isLoading={false} />
        </div>
    )
}

export default ClientsPage
