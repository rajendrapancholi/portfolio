import { Metadata } from 'next';
import Blogs from './Blogs';

export const metadata: Metadata = {
  title: 'Blogs | Rajendra Pancholi',
  description: 'Blogs Rajendra Pancholi',
};

export default async function BlogsPage() {
  return (<>
    <Blogs />
  </>);
}
