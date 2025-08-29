import { useEffect } from "preact/hooks";

interface PDFViewerProps {
  filename: string;
}

export default function PDFViewer({ filename }: PDFViewerProps) {
  useEffect(() => {
    async function loadPDF() {
      const response = await fetch(`/api/pdf/${filename}`);
      if (!response.ok) {
        console.error("Fehler beim Abrufen der PDF-Datei");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const pdfViewer = document.getElementById("pdf-viewer") as HTMLObjectElement | null;
      const downloadLink = document.getElementById("pdf-download-link") as HTMLAnchorElement | null;
      if (pdfViewer) pdfViewer.data = url;
      if (downloadLink) downloadLink.href = url;
    }
    loadPDF();
  }, [filename]);

  return (
    <>
      <object id="pdf-viewer" type="application/pdf" width="100%" height="600px">
        <p>
          Ihr Browser unterstützt keine PDFs.{" "}
          <a href="" id="pdf-download-link">
            PDF herunterladen
          </a>
          .
        </p>
      </object>
    </>
  );
}
