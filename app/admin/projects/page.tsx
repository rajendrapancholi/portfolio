import { Metadata } from 'next';
import Projects from './Projects';
import { ENV } from '@/config/env';

export const metadata: Metadata = {
  title: ENV.NEXT_PUBLIC_APP_NAME || 'Admin Projects',
};
const AdminProductsPage = () => {
  return (
    <Projects />
  );
};

export default AdminProductsPage;
