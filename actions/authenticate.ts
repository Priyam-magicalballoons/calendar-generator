"use server";

import { cookies } from "next/headers";

export const authenticateUser = async (
  id: string,
  password: string,
  rememberMe: boolean
) => {
  if (id === "admin" && password === "admin") {
    const cookieStore = await cookies();

    // If rememberMe = true → set persistent cookie
    if (rememberMe) {
      cookieStore.set("id", id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      // Session cookie (expires when browser closes)
      cookieStore.set("id", id, {
        httpOnly: true,
        path: "/",
      });
    }

    return { status: 200 };
  }

  return { status: 400 };
};
