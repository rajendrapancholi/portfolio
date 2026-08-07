import { Metadata } from 'next';
import Form from './Form';

export const metadata: Metadata = {
  title: 'Sign In | Rajendra Pancholi',
  description: 'Sign In Rajendra Pancholi',
};

export default async function SignIn() {
  return <Form />;
}
