import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import bcrypt from 'bcryptjs';
import UserModel from './models/UserModel';
import NextAuth, { Account, Profile, User } from 'next-auth';
import { connectToDB } from './database';

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await connectToDB();
        if (credentials == null) return null;

        const user = await UserModel.findOne({ email: credentials.email });

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );
          if (isMatch) {
            return {
              id: user._id.toString(), // Convert ObjectId to string
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
            };;
          }
        }
        return null;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/signin',
  },
  callbacks: {
    async jwt({ user, trigger, session, token }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
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
      if (account.provider == 'credentials') {
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
          });
          existingUser = await newUser.save();
        }

        return true;
      } catch (error: any) {
        console.log('Error checking if user exists: ', error.message);
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
