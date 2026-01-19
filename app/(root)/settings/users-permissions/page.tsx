import React from 'react';
import UsersList from './UsersList';


const UsersPage = () => {
    return (
        <div>
            <UsersList data={[]} isLoading={false} />
        </div>
    )
}

export default UsersPage
