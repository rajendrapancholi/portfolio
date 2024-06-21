import { auth } from '@/lib/auth';
import { connectToDB } from '@/lib/database';
import ProjectModel from '@/lib/models/ProjectModel';

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }
  await connectToDB();
  const project = await ProjectModel.findById(params.id);
  if (!project) {
    return Response.json(
      { message: 'project not found' },
      {
        status: 404,
      }
    );
  }
  return Response.json(project);
}) as any;

export const PUT = auth(async (...p: any) => {
  const [req, { params }] = p;
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }

  const { title, des, img, link, iconLists } = await req.json();

  try {
    await connectToDB();

    const project = await ProjectModel.findById(params.id);
    if (project) {
      project.title = title;
      project.des = des;
      project.img = img;
      project.link = link;
      project.iconLists = iconLists;

      const updatedProject = await project.save();
      return Response.json(updatedProject);
    } else {
      return Response.json(
        { message: 'Project not found' },
        {
          status: 404,
        }
      );
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }

  try {
    await connectToDB();
    const project = await ProjectModel.findById(params.id);
    if (project) {
      await project.deleteOne();
      return Response.json({ message: 'Project deleted successfully' });
    } else {
      return Response.json(
        { message: 'Project not found' },
        {
          status: 404,
        }
      );
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;
