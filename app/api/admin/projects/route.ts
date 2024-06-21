import { auth } from '@/lib/auth';
import { connectToDB } from '@/lib/database';
import ProjectModel from '@/lib/models/ProjectModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }
  await connectToDB();
  const projects = await ProjectModel.find();
  return Response.json(projects);
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }
  await connectToDB();
  const project = new ProjectModel({
    title: 'title',
    des: 'des',
    img: '/img',
    iconLists: ['/i1', '/i2', '/i3', '/i4', '/i5'],
    link: '/link',
  });
  try {
    await project.save();
    return Response.json(
      { message: 'Project created successfully', project },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;
