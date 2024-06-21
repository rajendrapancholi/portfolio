import AdminLayout from '@/components/admin/AdminLayout';
import Form from './Form';

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Edit User ${params.id}`,
  };
}

export default function UserEdit({ params }: { params: { id: string } }) {
  return (
    <AdminLayout activeItem="products">
      <Form userId={params.id} />
    </AdminLayout>
  );
}
