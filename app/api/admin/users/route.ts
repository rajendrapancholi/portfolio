import { auth } from '@/lib/auth';
import { connectToDB } from '@/lib/database';
import UserModel from '@/lib/models/UserModel';

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }
  await connectToDB();
  const users = await UserModel.find();
  return Response.json(users);
}) as any;
