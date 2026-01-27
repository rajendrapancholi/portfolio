"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/signin" });
}

export async function oauthLogin(provider: "google" | "github" | "linkedin") {
  await signIn(provider, { redirectTo: "/" });
}
