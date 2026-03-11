import React from 'react';
import AddProperty from '../../add-property/addProperty';

const Page = ({ params }: { params: { id: string } }) => {
  return <AddProperty propertyId={params.id} />;
};

export default Page;
