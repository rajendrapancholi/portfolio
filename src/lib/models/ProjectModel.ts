import mongoose, { Model, Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  des: string;
  img: string;
  link: string;
  iconLists: string[]; // paths to tech-stack icons
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    des: { type: String, required: true },
    img: { type: String, required: true },
    link: { type: String, required: true },
    iconLists: { type: [String], default: [] },
  },
  { timestamps: true },
);

// Check if model exists; otherwise, create it
const ProjectModel: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;

// TypeScript type for frontend use
export type Project = {
  _id?: string; // optional for when creating new projects
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
};
