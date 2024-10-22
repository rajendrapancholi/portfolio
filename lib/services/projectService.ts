import { cache } from 'react';
import ProjectModel, { Project } from '../models/ProjectModel';
import { connectToDB } from '../database';

export const revalidate = 3600; // revalidate the data at most every hour

const getRecent = cache(async () => {
  await connectToDB();
  const projects = await ProjectModel.find({}).sort({ _id: -1 }).lean();
  return projects as Project[];
});

const getBySlug = cache(async (slug: string) => {
  await connectToDB();
  const product = await ProjectModel.findOne({ slug }).lean();
  return product as Project[];
});

const projectService = {
  getRecent,
  getBySlug,
};
export default projectService;
