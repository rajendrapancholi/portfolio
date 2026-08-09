import projectService from '@/lib/services/projectService';
import { convertDocToObj } from '@/lib/utils/formatter';
import ProjectItem from './ProjectItem';
import { Reveal } from './ui/Reveal';

export default async function RecentProjects() {
  const recentProjects = await projectService.getRecent();
  return (
    <section id="projects" className="mt-20 px-2 md:px-4 w-full">
      <Reveal
        direction="up"
        className="text-4xl text-center md:text-5xl font-bold flex flex-col justify-center items-center"
      >
        <h1>A small selection of</h1>
        <span className="text-primary">recent projects</span>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
        {recentProjects.map((project, i) => (
          <ProjectItem key={i} project={convertDocToObj(project)} index={i} />
        ))}
      </div>
    </section>
  );
}
