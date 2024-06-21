import AdminLayout from '@/components/admin/AdminLayout';
import Form from './Form';

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Edit Project ${params.id}`,
  };
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  return (
    <AdminLayout activeItem="projects">
      <Form projectId={params.id} />
    </AdminLayout>
  );
}
