import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string | null;
      isAdmin?: boolean | null;
      role: "user" | "viewer" | "admin" | "author";
    } & DefaultSession["user"];
  }

  export interface User extends DefaultUser {
    _id?: string;
    role: "user" | "viewer" | "admin" | "author";
    isAdmin?: boolean;
  }
}
