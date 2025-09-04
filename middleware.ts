import { cookies, headers } from "next/headers";
import { redirect, usePathname } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const routes = ["/"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await (await cookies()).get("id");

  if (routes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
