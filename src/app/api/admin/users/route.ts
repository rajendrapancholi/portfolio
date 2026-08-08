import { auth } from '@/lib/auth';
import { connectToDB } from '@/lib/database';
import UserModel from '@/lib/models/UserModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }
  await connectToDB();
  const users = await UserModel.find().select('-password');
  return Response.json(users);
}) as any;
