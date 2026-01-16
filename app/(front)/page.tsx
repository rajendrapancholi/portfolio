import Approach from '@/components/Approach';
import Experience from '@/components/Experience';
import Grid from '@/components/Grid';
import Hero from '@/components/Hero';
import RecentProjects from '@/components/RecentProjects';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Rajendra Pancholi',
};

export default async function Home() {
  return (
    <div className="container flex flex-col mx-auto items-center justify-center dark:bg-black ">
      <Hero />
      <Grid />
      <RecentProjects />
      <Experience />
      <Approach />
    </div>
  );
}
