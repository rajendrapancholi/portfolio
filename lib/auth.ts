import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import UserModel from "./models/UserModel";
import NextAuth, { Account, Profile, User } from "next-auth";
import { connectToDB } from "./database";
import { ENV } from "@/config/env";

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();
        if (credentials == null) return null;

        const user = await UserModel.findOne({ email: credentials.email });
        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password as string,
          );
          if (isMatch) {
            return {
              id: user._id.toString(), // Convert ObjectId to string
              email: user.email,
              name: user.name,
              role: user.role,
              isAdmin: user.isAdmin && user.role === "admin",
            };
          }
        }
        return null;
      },
    }),
    GitHubProvider({
      clientId: ENV.GITHUB_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
    }),

    GoogleProvider({
      clientId: ENV.GOOGLE_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: ENV.LINKEDIN_ID,
      clientSecret: ENV.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  trustHost: true,
  pages: {
    signIn: "/signin",
    newUser: "/register",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user, _account }: any) {
      // On first login (credentials or OAuth)
      if (user) {
        // Fetch full user from DB to include isAdmin
        await connectToDB();
        const dbUser = await UserModel.findOne({ email: user.email });
        token.user = {
          _id: dbUser?._id.toString(),
          name: dbUser?.name,
          email: dbUser?.email,
          role: dbUser?.role || "viewer",
          isAdmin: dbUser?.isAdmin || false,
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
    async signIn({ account, profile, user }: any) {
      if (account.provider == "credentials") {
        return true;
      }
      try {
        await connectToDB();
        // Check if the user already exists
        let existingUser = await UserModel.findOne({ email: profile.email });
        // If not, create a new user in MongoDB
        if (!existingUser) {
          const newUser = new UserModel({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            role: "viewer",
            isAdmin: false,
          });
          existingUser = await newUser.save();
        }

        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
