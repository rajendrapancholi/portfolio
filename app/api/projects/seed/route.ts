import data from '@/lib/data';
import { connectToDB } from '@/lib/database';
import ProjectModel from '@/lib/models/ProjectModel';
import UserModel from '@/lib/models/UserModel';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { users, projects } = data;
  await connectToDB();
  await UserModel.deleteMany();
  await UserModel.insertMany(users);

  await ProjectModel.deleteMany();
  await ProjectModel.insertMany(projects);

  return NextResponse.json({
    message: 'seeded successfully',
    users,
    projects,
  });
};
