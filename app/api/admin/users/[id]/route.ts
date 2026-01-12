import { auth } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import UserModel from "@/lib/models/UserModel";

type Params = {
  params: Promise<{ id: string }>;
};

/* ===================== GET ===================== */
export const GET = auth(async (req, context: Params) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await connectToDB();
  const user = await UserModel.findById(id);

  if (!user) {
    return Response.json({ message: "user not found" }, { status: 404 });
  }

  return Response.json(user);
});

/* ===================== PUT ===================== */
export const PUT = auth(async (req, context: Params) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { name, email, isAdmin } = await req.json();

  await connectToDB();
  const user = await UserModel.findById(id);

  if (!user) {
    return Response.json({ message: "user not found" }, { status: 404 });
  }

  user.name = name;
  user.email = email;
  user.isAdmin = Boolean(isAdmin);

  await user.save();

  return Response.json({
    message: "User updated successfully",
    user,
  });
});

/* ===================== DELETE ===================== */
export const DELETE = auth(async (req, context: Params) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await connectToDB();
  const user = await UserModel.findById(id);

  if (!user) {
    return Response.json({ message: "user not found" }, { status: 404 });
  }

  if (user.isAdmin) {
    return Response.json(
      { message: "cannot delete admin user" },
      { status: 400 }
    );
  }

  await user.deleteOne();

  return Response.json({ message: "User deleted successfully" });
});
