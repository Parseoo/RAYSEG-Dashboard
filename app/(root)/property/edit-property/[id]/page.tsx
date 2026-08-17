import AddProperty from '../../add-property/addProperty';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AddProperty propertyId={id} />;
};

export default Page;
