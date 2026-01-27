export const ENV = {
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  BASE_URL:
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://rajendrapancholi.vercel.app",
  // Auth secrets
  AUTH_SECRET: process.env.AUTH_SECRET!, // nextauth
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!, // google
  GOOGLE_ID: process.env.GOOGLE_ID!,
  GOOGLE_VERIFICATION_SECRET: process.env.GOOGLE_VERIFICATION_SECRET,

  //github
  GITHUB_ID: process.env.GITHUB_ID!,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,

  // linked-in
  LINKEDIN_ID: process.env.LINKEDIN_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,

  SEED_SECRET: process.env.SEED_SECRET!, // api
  SEED_ENABLED: process.env.SEED_ENABLED!,

  // Main db
  MONGODB_URI: process.env.MONGODB_URI!,

  // Blog db
  BLOG_MONGODB_URI: process.env.BLOG_MONGODB_URI!,
  // Cloudinary secrets
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET!, // for main app
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,

  BLOG_CLOUDINAR_CLOUD_NAME: process.env.BLOG_CLOUDINAR_CLOUD_NAME!, // for blogs
  BLOG_CLOUDINAR_API_KEY: process.env.BLOG_CLOUDINAR_API_KEY!,
  BLOG_CLOUDINAR_API_SECRET: process.env.BLOG_CLOUDINAR_API_SECRET!,
  // Github .md files fetch secrets
  BLOG_GITHUB_TOKEN: process.env.BLOG_GITHUB_TOKEN!,
  NEXT_PUBLIC_REPO_OWNER: process.env.NEXT_PUBLIC_REPO_OWNER,
  NEXT_PUBLIC_REPO_NAME: process.env.NEXT_PUBLIC_REPO_NAME,
};
