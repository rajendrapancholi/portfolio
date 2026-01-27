import { ENV } from "@/config/env";
import data from "@/lib/data";
import { connectToDB } from "@/lib/database";
import ProjectModel from "@/lib/models/ProjectModel";
import UserModel from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  // Global kill switch for safety
  if (ENV.SEED_ENABLED !== "true") {
    return NextResponse.json({ message: "Seeding disabled" }, { status: 403 });
  }

  // Authorization check
  const secret = request.headers.get("x-admin-seed-secret");
  if (!secret || secret !== ENV.SEED_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDB();
    const { users, projects } = data;

    // Atomically clear and seed
    // await UserModel.deleteMany({});
    // await ProjectModel.deleteMany({});

    await UserModel.insertMany(users);
    await ProjectModel.insertMany(projects);

    return NextResponse.json({ message: "Seeded successfully" });
  } catch (error) {
    console.error("Seed Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
