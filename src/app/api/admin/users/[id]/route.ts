import { auth } from '@/lib/auth';
import { connectToDB } from '@/lib/database';
import UserModel from '@/lib/models/UserModel';

type Params = {
  params: Promise<{ id: string }>;
};

/* GET */
export const GET = auth(async (req, context: Params) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  await connectToDB();
  // Never send the password hash to the client.
  const user = await UserModel.findById(id).select('-password');

  if (!user) {
    return Response.json({ message: 'user not found' }, { status: 404 });
  }

  return Response.json(user);
});

/* PUT */
export const PUT = auth(async (req, context: Params) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  // `role` was previously accepted by the edit form but silently dropped
  // here, so the Role dropdown in the admin UI never actually saved.
  const { name, email, isAdmin, role } = await req.json();

  await connectToDB();
  const user = await UserModel.findById(id);

  if (!user) {
    return Response.json({ message: 'user not found' }, { status: 404 });
  }

  user.name = name;
  user.email = email;
  user.isAdmin = Boolean(isAdmin);
  if (role) {
    user.role = role;
  }

  await user.save();

  const { password, ...safeUser } = user.toObject();

  return Response.json({
    message: 'User updated successfully',
    user: safeUser,
  });
});

/* DELETE */
export const DELETE = auth(async (req, context: Params) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  await connectToDB();
  const user = await UserModel.findById(id);

  if (!user) {
    return Response.json({ message: 'user not found' }, { status: 404 });
  }

  if (user.isAdmin) {
    return Response.json(
      { message: 'cannot delete admin user' },
      { status: 400 },
    );
  }

  await user.deleteOne();

  return Response.json({ message: 'User deleted successfully' });
});
