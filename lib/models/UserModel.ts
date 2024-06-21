import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;
export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
};
