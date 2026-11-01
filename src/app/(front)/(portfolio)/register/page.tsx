import { Metadata } from 'next';
import { Suspense } from 'react';
import Form from './Form';

export const metadata: Metadata = {
  title: 'Register | Rajendra Pancholi',
  description: 'Register Rajendra Pancholi',
};

export default function Register() {
  return (
    <Suspense fallback={null}>
      <Form />
    </Suspense>
  );
}