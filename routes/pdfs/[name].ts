import { Handlers } from "$fresh/server.ts";

// Lockere Prüfung: erlaubt Buchstaben, Zahlen, Leerzeichen, Punkt, Bindestrich, Unterstrich und einige Satzzeichen
function isSafeFileName(name: string) {
  // verbietet nur Slash und Backslash, um Pfadtrennungen zu verhindern
  return !name.includes("/") && !name.includes("\\");
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    // URL-Parameter auslesen und decodieren
    const rawName = ctx.params.name;
    const name = decodeURIComponent(rawName);

    if (!isSafeFileName(name)) {
      return new Response("Ungültiger Dateiname", { status: 400 });
    }

    try {
      const filePath = `./routes/pdfs/${name}`;
      const file = await Deno.open(filePath, { read: true });
      const fileInfo = await Deno.stat(filePath);

      const headers = new Headers();
      headers.set("Content-Type", "application/pdf");
      headers.set("Content-Length", fileInfo.size.toString());
      headers.set(
        "Content-Disposition",
        `inline; filename="${name}"`,
      );

      return new Response(file.readable, { headers });
    } catch (err) {
      console.error("PDF-Auslieferungsfehler:", err);
      return new Response("Datei nicht gefunden", { status: 404 });
    }
  },
};
