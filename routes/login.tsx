import { Handlers, PageProps } from "$fresh/server.ts";

const PASSWORD = "changeme";

export const handler: Handlers = {
  GET: (_req, ctx) => {
    console.log("Handling GET /login");
    return ctx.render({ error: null });
  },

  POST: async (req, ctx) => {
    console.log("Handling POST /login");
    const form = await req.formData();
    const password = form.get("password");

    console.log(`Received password: ${password}, type: ${typeof password}`);

    if (typeof password !== "string" || password.trim() !== PASSWORD) {
      console.log("Password invalid or not a string");
      return ctx.render({ error: "Ungültiges Passwort" });
    }

    console.log("Password valid, setting cookie and redirecting to /home");
    return new Response(null, {
      status: 303,
      headers: {
        "Location": "/home",
        "Set-Cookie": `session=1; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600; Secure=${
          Deno.env.get("DENO_DEPLOY") === "true"
        }`,
      },
    });
  },
};

export default function LoginPage(
  { data }: PageProps<{ error: string | null }>,
) {
  return (
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      {data.error && <p class="text-red-500 mb-4">{data.error}</p>}
      <form method="POST" action="/login" class="flex flex-col gap-4">
        <label class="flex flex-col">
          Passwort:
          <input
            type="password"
            name="password"
            class="mt-1 p-2 border rounded"
            autoComplete="current-password"
            required
          />
        </label>
        <button
          type="submit"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Anmelden
        </button>
      </form>
    </div>
  );
}