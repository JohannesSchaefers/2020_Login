import { Handlers, PageProps } from "$fresh/server.ts";
import { listPDFFiles } from "../main.ts";

interface Data {
  files: string[];
  subdomain: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    // Zugriff auf Umgebungsvariablen mit Deno.env.get
    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const subdomain = Deno.env.get("SUBDOMAIN");

    // Debug-Ausgabe
    console.log("R2_BUCKET_NAME:", bucketName);
    console.log("SUBDOMAIN:", subdomain);

    // Helper zum Validieren
    function checkEnvVar(variable: string | undefined, name: string): void {
      if (!variable?.trim()) {
        console.error(`Fehler: ${name} ist nicht gesetzt oder leer`);
        throw new Error(`${name} fehlt`);
      }
    }

    // Validierung der Variablen
    checkEnvVar(bucketName, "R2_BUCKET_NAME");
    checkEnvVar(subdomain, "SUBDOMAIN");

    try {
      // Dateien aus dem Bucket holen
      const files = await listPDFFiles(bucketName!);

      // Daten an die Seite weitergeben
      return ctx.render({ files, subdomain: subdomain! });
    } catch (error) {
      console.error(
        `Failed to list PDF files: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return ctx.render({ files: [], subdomain: subdomain! });
    }
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { files, subdomain } = data;

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-2xl font-bold">PDF-Dateien</h1>
      {files.length === 0 ? (
        <p>Keine PDF-Dateien gefunden!!</p>
      ) : (
        <ul class="mt-4">
          {files.map((file) => (
            <li key={file}>
              <a
                href={`https://${subdomain}/${file}`}
                class="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener"
              >
                {file}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
