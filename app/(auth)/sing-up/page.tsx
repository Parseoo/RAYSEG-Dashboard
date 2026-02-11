import { redirect } from 'next/navigation';

const page = () => {
  redirect('/sign-in');
}

export default page