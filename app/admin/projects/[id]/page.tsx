import Form from './Form';
import { Metadata } from 'next';

// need to destructure the params from the Promise and await it.
export async function generateMetadata({ params }: { params: Promise<{ id: string; }>; }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Edit Project ${resolvedParams.id}`,
  };
}

// page component must be async to await the params object.
export default async function ProjectDetails({ params }: { params: Promise<{ id: string; }>; }) {
  const resolvedParams = await params;

  return (
    <Form projectId={resolvedParams.id} />
  );
}

