import mongoose, { Model, Document, Schema } from "mongoose";
import { User } from "./UserModel";

export interface IBlog extends Document {
  _id: string;
  slug: string;
  description: string;
  content: string;
  images?: string[];
  published: boolean;
  author: User;
}

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    content: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const BlogModel: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default BlogModel;

export type Blog = {
  _id: string;
  slug: string;
  title: string;
  author: User;
  content: string;
  published: boolean;
};
