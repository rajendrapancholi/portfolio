import { connectToDB } from '@/lib/database';
import ProjectModel from '@/lib/models/ProjectModel';
import UserModel from '@/lib/models/UserModel';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    await connectToDB();
    const users = await UserModel.find({});
    const projects = await ProjectModel.find({});
    return NextResponse.json(
      {
        message: 'Users and projects fetch succefull.',
        users,
        projects,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 501 });
  }
};
