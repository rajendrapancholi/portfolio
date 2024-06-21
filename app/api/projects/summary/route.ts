import { auth } from '@/lib/auth';
import { connectToDB } from '@/lib/database';
import ProjectModel from '@/lib/models/ProjectModel';
import UserModel from '@/lib/models/UserModel';

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }
  await connectToDB();

  const projectsCount = await ProjectModel.countDocuments();
  const usersCount = await UserModel.countDocuments();

  const projectsData = await ProjectModel.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const usersData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return Response.json({
    projectsCount,
    usersCount,
    projectsData,
    usersData,
  });
});
