import { getCookies } from "https://deno.land/std@0.181.0/http/cookie.ts";

import type { MiddlewareHandlerContext } from "https://deno.land/x/fresh@1.1.2/server.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const cookies = getCookies(req.headers);
  if (!cookies.session) {
    return Response.redirect("/login", 303);
  }
  return await ctx.next();
}
