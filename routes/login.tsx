import { Handlers, PageProps } from "$fresh/server.ts";

const PASSWORD = "changeme"; // Bitte auf sicheres Passwort setzen

export const handler: Handlers = {
  GET: (_req, ctx) => {
    return ctx.render({ error: null });
  },

  POST: async (req, ctx) => {
    const form = await req.formData();
    const password = form.get("password");

    if (password !== PASSWORD) {
      return ctx.render({ error: "Ungültiges Passwort" });
    }

    // Redirect + Cookie setzen – kein Response.redirect(), damit Header nicht immutable sind
    return new Response(null, {
      status: 303,
      headers: {
        "Location": "/",
        "Set-Cookie": "session=1; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600",
      },
    });
  },
};

export default function LoginPage(
  { data }: PageProps<{ error: string | null }>,
) {
  return (
    <div style={{ maxWidth: "320px", margin: "auto", padding: "1rem" }}>
      <h1>Login</h1>
      {data.error && <p style={{ color: "red" }}>{data.error}</p>}
      <form method="post">
        <label>
          Passwort:
          <br />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: "0.5rem" }}>
          Anmelden
        </button>
      </form>
    </div>
  );
}
