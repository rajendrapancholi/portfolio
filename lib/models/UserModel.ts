// import { get } from 'http';
// import mongoose, { Model } from 'mongoose';

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password?: string;
//   image?: string;
//   isAdmin: boolean;
// }


// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//     },
//     image: {
//       type: String,
//     },
//     isAdmin: { type: Boolean, required: true, default: false },
//   },
//   { timestamps: true }
// );

// // const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema as any);

// export default UserModel;
// export type User = {
//   _id: string;
//   name: string;
//   email: string;
//   image?: string;
//   isAdmin: boolean;
// };


import mongoose, { Model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string,
  name: string;
  email: string;
  password?: string;
  image?: string;
  isAdmin: boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Check if model exists; otherwise, create it
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;

export type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
};
