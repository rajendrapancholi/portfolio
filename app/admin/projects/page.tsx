import AdminLayout from '@/components/admin/AdminLayout';

import { Metadata } from 'next';
import Projects from './Projects';

export const metadata: Metadata = {
  title: 'Admin Projects' || process.env.NEXT_PUBLIC_APP_NAME,
};
const AdminProductsPage = () => {
  return (
    <AdminLayout activeItem="projects">
      <Projects />
    </AdminLayout>
  );
};

export default AdminProductsPage;
