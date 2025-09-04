import { cookies, headers } from "next/headers";
import { redirect, usePathname } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const routes = [
  "/login",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main-app.js",
  "/_next/static/chunks/app-pages-internals.js",
  "/_next/static/chunks/app/layout.js",
  "/_next/static/chunks/app/login/page.js",
  "/_next/static/chunks/_app-pages-browser_node_modules_next_dist_client_dev_noop-turbopack-hmr_js.js",
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await (await cookies()).get("id");

  if (!routes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
