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
