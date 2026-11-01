import { Metadata } from 'next';
import { Suspense } from 'react';
import Form from './Form';

export const metadata: Metadata = {
  title: 'Sign In | Rajendra Pancholi',
  description: 'Sign In Rajendra Pancholi',
};

export default function SignIn() {
  return (
    <Suspense fallback={null}>
      <Form />
    </Suspense>
  );
}
