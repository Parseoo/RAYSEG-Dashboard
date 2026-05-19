import React from 'react';
import AddClient from '../../add-client/addClient';

const Page = ({ params }: { params: { id: string } }) => {
  return <AddClient clientId={params.id} />;
};

export default Page;
