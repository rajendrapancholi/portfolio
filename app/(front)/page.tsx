import Hero from '@/components/Hero';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Rajendra Pancholi Portfolio',
};

export default async function Home() {
  return (
    <div className="">
      <div className="w-full">
        <Hero />
      </div>
    </div>
  );
}
