import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: ['Title is required!', true],
    },
    des: {
      type: String,
      required: ['Description is required!', true],
    },
    img: {
      type: String,
      required: ['Image is required!', true],
    },
    link: {
      type: String,
      required: ['Link is required!', true],
    },
    iconLists: [],
  },
  { timestamps: true }
);

const ProjectModel =
  mongoose.models?.Project || mongoose.model('Project', ProjectSchema);

export default ProjectModel;

export type Project = {
  _id: string;
  title: string;
  des: string;
  img: string;
  iconLists: [icon];
  link: string;
};

export type icon = {
  icon1: string;
  icon2: string;
  icon3: string;
  icon4: string;
  icon5: string;
};
