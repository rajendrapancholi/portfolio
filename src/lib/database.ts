import { ENV } from '@/config/env';
import mongoose from 'mongoose';

const g = globalThis as unknown as {
  _mainDb?: Promise<typeof mongoose>;
  _blogDb?: Promise<mongoose.Connection>;
};

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!g._mainDb) {
    g._mainDb = mongoose
      .connect(ENV.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        dbName: 'portfolio',
        bufferCommands: false,
      })
      .catch((error) => {
        g._mainDb = undefined;
        console.error('MongoDB Connection Error:', error);
        throw new Error('Database connection failed');
      });
  }
  await g._mainDb;
  return mongoose.connection;
};

export const connectToBlogDB = async () => {
  if (!g._blogDb) {
    g._blogDb = mongoose
      .createConnection(ENV.BLOG_MONGODB_URI!, {
        serverSelectionTimeoutMS: 5000,
        dbName: 'blogdb',
        bufferCommands: false,
      })
      .asPromise()
      .catch((error) => {
        g._blogDb = undefined;
        console.error('Blog DB Connection Error:', error);
        throw new Error('Failed to connect to Blog Database');
      });
  }
  return g._blogDb;
};
