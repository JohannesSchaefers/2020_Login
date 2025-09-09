// routes/login.tsx
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<{ error?: string }> = {
  // Handle GET requests to render the login page
  GET(req, ctx) {
    console.log("Handling GET /login");
    // Check if already authenticated
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => c.trim().split("=")),
    );
    if (cookies.auth === "valid") {
      console.log("Already authenticated, redirecting to /home");
      return new Response(null, {
        status: 302,
        headers: { Location: "/home" },
      });
    }
    // Always pass a data object to ctx.render
    const url = new URL(req.url);
    const error = url.searchParams.get("error") || undefined;
    return ctx.render({ error });
  },

  // Handle POST requests for password submission
  async POST(req, ctx) {
    console.log("Handling POST /login");
    try {
      // Get form data
      const formData = await req.formData();
      const password = formData.get("password")?.toString();

      if (!password) {
        console.log("No password provided");
        return new Response(null, {
          status: 302,
          headers: { Location: "/login?error=Missing%20password" },
        });
      }

      // Replace with your actual password validation logic
      const isValidPassword = password === Deno.env.get("LOGIN_PASSWORD") || "secret123"; // Use env var or fallback
      if (isValidPassword) {
        console.log("Password valid, setting auth cookie");
        const headers = new Headers({ Location: "/home" });
        headers.set("Set-Cookie", "auth=valid; HttpOnly; Path=/; Max-Age=3600"); // 1-hour cookie
        return new Response(null, { status: 302, headers });
      } else {
        console.log("Invalid password");
        return new Response(null, {
          status: 302,
          headers: { Location: "/login?error=Invalid%20password" },
        });
      }
    } catch (error) {
      console.error("Error processing login:", error);
      return new Response(null, {
        status: 302,
        headers: { Location: "/login?error=Server%20error" },
      });
    }
  },
};

export default function LoginPage({ data }: PageProps<{ error?: string }>) {
  // Fallback to handle undefined data
  const error = data?.error || undefined;
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <form method="POST" action="/login">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}