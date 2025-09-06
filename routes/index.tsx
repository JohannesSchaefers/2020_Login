import { Handlers, PageProps } from "$fresh/server.ts";
import { S3Client, ListObjectsV2Command } from "npm:@aws-sdk/client-s3";
import PDFViewer from "../islands/PDFViewer.tsx";


type PDFItem = { name: string };

const BUCKET = "2020-rechnungen";
const ENDPOINT = "https://a472768f5dff0e95af7610729ca9c462.eu.r2.cloudflarestorage.com";
const REGION = "weur";
const ACCESS_KEY_ID = Deno.env.get("R2_ACCESS_KEY_ID");
const SECRET_ACCESS_KEY = Deno.env.get("R2_SECRET_ACCESS_KEY");

const s3 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const handler: Handlers<{ pdfs: PDFItem[]; error?: string }> = {
  async GET(req, ctx) {
    const pdfs: PDFItem[] = [];
    try {
      const command = new ListObjectsV2Command({ Bucket: BUCKET });
      const result = await s3.send(command);
      for (const item of result.Contents ?? []) {
        if (item.Key && item.Key.toLowerCase().endsWith(".pdf")) {
          pdfs.push({ name: item.Key });
        }
      }
    } catch {
      // Fehler beim Auslesen des Buckets ignorieren
    }

    const url = new URL(req.url);
    const error = url.searchParams.get("error") || undefined;

    return ctx.render({ pdfs, error });
  },
};
/*
export default function Home({
  data,
}: PageProps<{ pdfs: PDFItem[]; error?: string }>) {
  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>PDF-Upload</h1>
      <a href="/logout" style={{ float: "right" }}>
        Logout
      </a>
      {data.error && <p style={{ color: "red" }}>Fehler: {data.error}</p>}
      <form action="/api/upload" method="post" encType="multipart/form-data">
        <input type="file" name="pdf" accept="application/pdf" required />
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Hochladen
        </button>
      </form>
      <h2>Hochgeladene PDFis</h2>
      <ul>
        {data.pdfs.length === 0 && <li>Keine PDFs gefunden.</li>}
        {data.pdfs.map((pdf) => (
          <li key={pdf.name}>
            <a
              href={`/pdfs/${encodeURIComponent(pdf.name)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pdf.name}
            </a>{" "}
            <form
              action={`/api/delete?name=${encodeURIComponent(pdf.name)}`}
              method="post"
              style={{ display: "inline" }}
            >
              <button type="submit" style={{ color: "red" }}>
                Löschen
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
*/
export default function Home({
  data,
}: PageProps<{ pdfs: PDFItem[]; error?: string }>) {
  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>PDF-Upload</h1>
      <a href="/logout" style={{ float: "right" }}>
        Logout
      </a>
      {data.error && <p style={{ color: "red" }}>Fehler: {data.error}</p>}

      <form action="/api/upload" method="post" encType="multipart/form-data">
        <input type="file" name="pdf" accept="application/pdf" required />
        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          Hochladen
        </button>
      </form>

      <h2>Hochgeladene PDFis</h2>
      <ul>
        {data.pdfs.length === 0 && <li>Keine PDFs gefunden.</li>}
        {data.pdfs.map((pdf) => (
          <li key={pdf.name}>
            {/* Use pdf.name variable here */}
            <PDFViewer filename={pdf.name} />
            <a
              href={`/pdfs/${encodeURIComponent(pdf.name)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pdf.name}
            </a>{" "}
            <form
              action={`/api/delete?name=${encodeURIComponent(pdf.name)}`}
              method="post"
              style={{ display: "inline" }}
            >
              <button type="submit" style={{ color: "red" }}>
                Löschen
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
