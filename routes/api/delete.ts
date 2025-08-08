import { Handlers } from "$fresh/server.ts";

function isSafeFileName(name: string) {
  return !name.includes("/") && !name.includes("\\");
}

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const rawName = url.searchParams.get("name");
    if (!rawName) {
      return new Response("Kein Dateiname angegeben", { status: 400 });
    }

    const name = decodeURIComponent(rawName);

    if (!isSafeFileName(name)) {
      return new Response("Ungültiger Dateiname", { status: 400 });
    }

    try {
      await Deno.remove(`./routes/pdfs/${name}`);
      return new Response("", {
        status: 303,
        headers: { location: "/" },
      });
    } catch (error) {
      console.error("Lösch-Fehler:", error);
      return new Response("Fehler beim Löschen der Datei", { status: 500 });
    }
  },
};
