import { Handlers, PageProps } from "$fresh/server.ts";

type PDFItem = { name: string };

export const handler: Handlers<{ pdfs: PDFItem[]; error?: string }> = {
  async GET(req, ctx) {
    const pdfs: PDFItem[] = [];
    try {
      for await (const entry of Deno.readDir("./routes/pdfs")) {
        if (entry.isFile && entry.name.toLowerCase().endsWith(".pdf")) {
          pdfs.push({ name: entry.name });
        }
      }
    } catch {
      // Ordner nicht gefunden oder leer, ignorieren
    }

    const url = new URL(req.url);
    const error = url.searchParams.get("error") || undefined;

    return ctx.render({ pdfs, error });
  },
};

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

      <h2>Hochgeladene PDFs</h2>
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
