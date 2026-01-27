"use server";

import { auth } from "@/lib/auth";
import { handleCloudinaryDelete } from "@/lib/cloudinary";
import { connectToDB } from "@/lib/database";
import { Blog, getBlogModel } from "@/lib/models/BlogModel";
import UserModel from "@/lib/models/UserModel";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function createBlog(formData: FormData) {
  try {
    // Authorization Check
    const session = await auth();
    if (!session || !session.user.isAdmin || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized: Admin access required." };
    }

    // Data Extraction
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const thumbnailValue = formData.get("thumbnail") as string;
    const thumbnail =
      thumbnailValue && thumbnailValue !== "/default-blog-thumb.webp"
        ? thumbnailValue
        : null;
    // const blogDocImgsLnk = formData.getAll("blogDocImgsLnk") as string[];

    // SEO-friendly slug generation
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Database Operation
    const BlogModel = await getBlogModel();
    const newBlog = await BlogModel.create({
      title,
      content,
      slug,
      thumbnail,
      author_id: session.user._id,
    });

    const insertedId = newBlog._id.toString();

    // manually clear the cache
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/admin/blogs");

    return {
      success: true,
      id: insertedId,
      slug: newBlog.slug,
      message: "Blog created successfully!",
    };
  } catch (error: any) {
    console.error("Create Error:", error);

    if (error.code === 11000) {
      return {
        success: false,
        error: "A blog with this title already exists.",
      };
    }

    return {
      success: false,
      error:
        error.message ||
        "An unexpected error occurred during database insertion.",
    };
  }
}

export interface BlogResponse {
  success: boolean;
  data?: Blog | null;
  error?: string;
}
export const getBlogBySlug = cache(
  async (slug: string): Promise<BlogResponse> => {
    try {
      const BlogModel = await getBlogModel();
      const blog = await BlogModel.findOne({ slug }).lean();
      if (!blog)
        return { success: false, error: "Blog not found!", data: null };

      await connectToDB();
      const authorData = await UserModel.findOne({
        _id: blog.author_id,
      }).lean();

      const serializedBlog = {
        ...blog,
        _id: blog._id.toString(),
        createdAt: new Date(blog.createdAt).toLocaleDateString("en-US"),
        updatedAt: new Date(blog.updatedAt).toLocaleDateString("en-US"),
        author: {
          id: blog.author_id.toString(),
          name: authorData?.name || "Unknown Author",
          image: authorData?.image || null,
        },
      };

      const cleanData = JSON.parse(JSON.stringify(serializedBlog));
      return { success: true, data: cleanData };
    } catch (error: any) {
      console.error("Error: ", error);
      return { success: false, error: "Failed to fetch blog!" };
    }
  },
);

export interface BlogsResponse {
  success: boolean;
  data?: Blog[] | null;
  error?: string;
}
export const getAllBlogs = cache(async (): Promise<BlogsResponse> => {
  try {
    const BlogModel = await getBlogModel();

    const blogs = await BlogModel.find({})
      .select("-content") // The minus sign (-): "exclude this field"
      .sort({ createdAt: -1 })
      .lean();

    await connectToDB();
    const authorIds = blogs.map((b: any) => b.author_id);

    // Fetch only the 'name' field for these IDs
    const authors = await UserModel.find(
      { _id: { $in: authorIds } },
      { name: 1, image: 1 },
    ).lean();

    const serializedBlogs = blogs.map((blog: any) => {
      // Find the author object that matches this blog's author_id
      const authorData = authors.find(
        (auth: any) => auth._id.toString() === blog.author_id.toString(),
      );
      return {
        ...blog,
        _id: blog._id.toString(),
        createdAt: blog.createdAt.toLocaleDateString("en-IN"),
        updatedAt: blog.updatedAt.toLocaleDateString("en-IN"),
        // Attach the author name and image found in the lookup
        author: {
          id: blog.author_id.toString(),
          name: authorData?.name || "Unknown Author",
          image: authorData?.image || null,
        },
      };
    });

    const cleanData = JSON.parse(JSON.stringify(serializedBlogs));

    return { success: true, data: cleanData };
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return {
      success: false,
      error: "Failed to retrieve blogs from the database.",
    };
  }
});

export async function getBlogList() {
  const { success, data: posts, error } = await getAllBlogs();
  if (!success || !posts) return { success: false, error };
  const pList = posts.map(({ content, ...rest }) => rest);
  return { success: true, data: pList };
}

/*

export async function updateBlog(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user.isAdmin)
      return { success: false, error: "Unauthorized" };

    await connectToDB();

    const updateData = {
      title: formData.get("title"),
      content: formData.get("content"),
      thumbnail: formData.get("thumbnail"),
      blogDocImgsLnk: formData.getAll("blogDocImgsLnk"),
      slug: (formData.get("title") as string)
        .toLowerCase()
        .replace(/\s+/g, "-"),
    };

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedBlog) return { success: false, error: "Blog not found" };

    revalidatePath(`/blog/${updatedBlog.slug}`);
    revalidatePath("/blog");

    return {
      success: true,
      id: updatedBlog._id.toString(),
      message: "Update successful",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
  */

export interface BlogDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function deleteBlog(id: string): Promise<BlogDeleteResponse> {
  try {
    // security checks
    const session = await auth();
    if (!session || !session.user || new Date(session.expires) < new Date())
      return { success: false, error: "Unauthorized: Session expired" };
    if (!session?.user.isAdmin && session?.user.role === "admin")
      return { success: false, error: "Forbidden: Admin access required" };

    await connectToDB(); // connect to main DB

    const usrExists = await UserModel.findById(session.user._id).lean(); // Verify user in db
    if (!usrExists?.isAdmin || usrExists?.role !== "admin")
      return { success: false, error: "Invalid user!" };

    // Find blog to get thumbnail/images for Cloudinary cleanup
    const BlogModel = await getBlogModel();
    const blog = await BlogModel.findById(id).lean();
    if (!blog)
      return {
        success: false,
        error: "Blog already deleted or does not exist.",
      };

    if (blog.thumbnail && blog.thumbnail.includes("cloudinary")) {
      const cloudSuccess = await handleCloudinaryDelete(blog.thumbnail);
      if (!cloudSuccess) {
        return {
          success: false,
          error: "Cloudinary Error: Image deletion failed.",
        };
      }
    }

    const result = await BlogModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      return { success: false, error: "Database Error: Could not delete." };
    }

    // Purge cache
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");
    return { success: true, message: `"${id}" blog permanently deleted!` };
  } catch (error: any) {
    return { success: false, error: "Deletion failed" };
  }
}
