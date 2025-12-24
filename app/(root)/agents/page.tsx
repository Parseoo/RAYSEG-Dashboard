import React from 'react';
import Agents from './AgentsList';

const AgentsPage = () => {
    return (
        <div>
            <Agents data={[]} isLoading={false} />
        </div>
    )
}

export default AgentsPage