import AddClient from '../../add-client/addClient';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AddClient clientId={id} />;
};

export default Page;
