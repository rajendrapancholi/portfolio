import React from 'react';
import projectService from '@/lib/services/projectService';

import { convertDocToObj } from '@/lib/utils';

import ProjectItem from './ProjectItem';

export default async function RecentProjects() {
  const recentProjects = await projectService.getRecent();
  return (
    <div
      id="projects"
      className="py-20 p-2 h-full w-full flex flex-col justify-center items-center"
    >
      <div className="text-4xl md:text-5xl font-bold flex flex-col justify-center items-center">
        <h1>A small selection of</h1>
        <span className="text-blue-400">recent projects</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-16 mt-10">
        {recentProjects.map((project, i) => (
          <ProjectItem key={i} project={convertDocToObj(project)} />
        ))}
      </div>
    </div>
  );
}
