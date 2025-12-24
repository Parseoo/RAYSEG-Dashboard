import React from 'react';
import Clients from '@/app/(root)/clients/ClientsList';

const ClientsPage = () => {
    return (
        <div>
            <Clients data={[]} isLoading={false} />
        </div>
    )
}

export default ClientsPage
