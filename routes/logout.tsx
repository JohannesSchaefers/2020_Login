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
