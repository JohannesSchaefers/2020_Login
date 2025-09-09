/*
// routes/pdfs/_middleware.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  console.log(`Middleware handling ${req.url}`);
  const cookies = getCookies(req.headers);

  if (!cookies.auth || cookies.auth !== "valid") {
    console.log("No valid auth cookie, redirecting to /login");
    // Construct absolute URL from request
    const url = new URL(req.url);
    const redirectUrl = `${url.origin}/login?error=Unauthorized`;
    return Response.redirect(redirectUrl, 303);
  }

  return await ctx.next();
}
*/
// routes/pdfs/_middleware.ts

import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  console.log(`Middleware handling ${req.url}`);
  const cookies = getCookies(req.headers);

  if (!cookies.auth || cookies.auth !== "valid") {
    console.log("No valid auth cookie, redirecting to /login");
    const url = new URL(req.url);
    const redirectUrl = `${url.origin}/login?error=Unauthorized`;
    return Response.redirect(redirectUrl, 303);
  }

  return await ctx.next();
}