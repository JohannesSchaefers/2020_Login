/*
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    return new Response(null, {
      status: 303,
      headers: {
        "Location": "/login",
        "Set-Cookie": "session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax",
      },
    });
  },
};
*/

import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: (_req) => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": `auth=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
      },
    });
  },
};