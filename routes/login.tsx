// routes/login.tsx
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<{ error?: string }> = {
  GET(req, ctx) {
    console.log("Handling GET /login");
    const cookies = Object.fromEntries(
      (req.headers.get("cookie") || "").split(";").map((c) => c.trim().split("=")),
    );
    if (cookies.auth === "valid") {
      console.log("Already authenticated, redirecting to /home");
      return new Response(null, { status: 302, headers: { Location: "/home" } });
    }
    const error = new URL(req.url).searchParams.get("error") || undefined;
    return ctx.render({ error });
  },
  async POST(req, ctx) {
    console.log("Handling POST /login");
    try {
      const formData = await req.formData();
      const password = formData.get("password")?.toString();
      if (!password) {
        return new Response(null, { status: 302, headers: { Location: "/login?error=Missing%20password" } });
      }
      const isValidPassword = password === Deno.env.get("LOGIN_PASSWORD") || "secret123";
      if (isValidPassword) {
        const headers = new Headers({ Location: "/home" });
        headers.set("Set-Cookie", "auth=valid; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure");
        return new Response(null, { status: 302, headers });
      }
      return new Response(null, { status: 302, headers: { Location: "/login?error=Invalid%20password" } });
    } catch (error) {
      console.error("Error processing login:", error);
      return new Response(null, { status: 302, headers: { Location: "/login?error=Server%20error" } });
    }
  },
};

export default function LoginPage({ data }: PageProps<{ error?: string }>) {
  const error = data?.error || undefined;
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <form method="POST" action="/login">
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}