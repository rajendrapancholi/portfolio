import mongoose, { Model, Document, Schema } from "mongoose";
import { connectToBlogDB } from "../database";
import { User } from "./UserModel";

export interface IBlog {
  slug: string;
  title: string;
  type: string;
  description: string;
  content: string;
  published: boolean;
  thumbnail: string;
  author_id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// This automatically includes _id: ObjectId
export interface IBlogDocument extends IBlog, Document {}

const BlogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String },
    description: String,
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
    thumbnail: { type: String },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export async function getBlogModel() {
  const conn = await connectToBlogDB();
  if (conn.readyState !== 1) {
    await conn.asPromise();
  }
  // Prevent re-compilation of the model during Next.js Hot Reloading
  const BlogModel: Model<IBlog> =
    conn.models.Blog || conn.model<IBlog>("Blog", BlogSchema); // Register the model on the specific 'blogdb' connection instance
  return BlogModel;
}

export type Blog = {
  _id: string;
  slug: string;
  title: string;
  type: string;
  tags?: string[];
  description: string;
  content?: string;
  published?: boolean;
  thumbnail?: string;
  author: Partial<User>;
  editUrl?: string;
  createdAt: string;
  updatedAt: string;
  source: "git" | "main" | "unknown";
};
export interface MrgTyp extends Blog {
  fm: "git" | "main" | "unknown";
}
