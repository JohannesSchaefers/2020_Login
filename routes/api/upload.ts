import { Handlers } from "$fresh/server.ts";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const handler: Handlers = {
  async POST(req) {
    try {
      const form = await req.formData();
      const file = form.get("pdf");
      if (!(file instanceof File)) {
        return Response.redirect(
          new URL("/?error=Keine Datei ausgewählt", req.url),
          303,
        );
      }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return Response.redirect(
          new URL("/?error=Nur PDF-Dateien erlaubt", req.url),
          303,
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return Response.redirect(
          new URL("/?error=Datei zu groß (max 10MB)", req.url),
          303,
        );
      }

      await Deno.mkdir("./routes/pdfs", { recursive: true });

      const safeName = file.name.replaceAll("/", "_").replaceAll("\\", "_");

      let fileName = safeName;
      let counter = 1;
      while (await exists(`./routes/pdfs/${fileName}`)) {
        const dotIndex = safeName.lastIndexOf(".");
        const base = dotIndex === -1 ? safeName : safeName.slice(0, dotIndex);
        const ext = dotIndex === -1 ? "" : safeName.slice(dotIndex);
        fileName = `${base}-${counter++}${ext}`;
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      await Deno.writeFile(`./routes/pdfs/${fileName}`, bytes);

      return Response.redirect(new URL("/", req.url), 303);
    } catch (error) {
      console.error("Upload-Fehler:", error);
      return Response.redirect(
        new URL("/?error=Serverfehler beim Upload", req.url),
        303,
      );
    }
  },
};

async function exists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}
