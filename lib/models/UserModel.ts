import mongoose, { Model, Document, HydratedDocument } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "viewer" | "admin" | "author";
  isAdmin: boolean;
}
export type IUserDocument = HydratedDocument<IUser>;

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: { type: String },
    image: { type: String },
    role: {
      type: String,
      default: "viewer",
      enum: ["user", "viewer", "admin", "author"],
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

// Check if model exists; otherwise, create it
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;

export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "viewer" | "admin" | "author";
  isAdmin: boolean;
};
