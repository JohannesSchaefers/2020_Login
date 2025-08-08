import { MiddlewareHandlerContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url);
  const path = url.pathname;

  const publicPaths = ["/login", "/static"];

  if (publicPaths.some(p => path.startsWith(p))) {
    return await ctx.next();
  }

  const cookie = req.headers.get("cookie") ?? "";
  const isLoggedIn = cookie.split(";").some(c => c.trim() === "session=1");

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.url), 303);
  }

  return await ctx.next();
}
