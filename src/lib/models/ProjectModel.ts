import mongoose, { Model, Document, Schema } from 'mongoose';


export interface IProject extends Document {
  title: string;
  des: string;
  img: string;
  link: string;
  iconLists: icon[]; // array of icons
}
const IconSchema = new Schema(
  {
    icon1: { type: String },
    icon2: { type: String },
    icon3: { type: String },
    icon4: { type: String },
    icon5: { type: String },
  },
  { _id: false }
);
const ProjectSchema = new mongoose.Schema<IProject>(
  {
    title: { type: String, required: true },
    des: { type: String, required: true },
    img: { type: String, required: true },
    link: { type: String, required: true },
    iconLists: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Check if model exists; otherwise, create it
const ProjectModel: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;

// TypeScript type for frontend use
export type Project = {
  _id?: string;          // optional for when creating new projects
  title: string;
  des: string;
  img: string;
  iconLists: icon[];     // array of icons
  link: string;
};

// Icon type
export type icon = {
  icon1?: string;
  icon2?: string;
  icon3?: string;
  icon4?: string;
  icon5?: string;
};
