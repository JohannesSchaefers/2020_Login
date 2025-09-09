/*
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    // Check for auth cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [key, value] = c.trim().split("=");
        return [key, value];
      }),
    );
    const isAuthenticated = cookies.auth === "valid";
    console.log("Handling GET /, Is authenticated:", isAuthenticated);

    // Redirect to /home if authenticated, otherwise to /login
    return new Response(null, {
      status: 302,
      headers: { Location: isAuthenticated ? "/home" : "/login" },
    });
  },
};
*/

// routes/index.tsx

import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req) {
    return new Response(null, {
      status: 303, // Consistent with middleware.ts
      headers: { Location: "/login" },
    });
  },
};

export default function Home() {
  return null; // No content needed, as it redirects
}
