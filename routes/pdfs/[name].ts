/*
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
*/


import { Handlers } from "$fresh/server.ts";
import { S3Client, GetObjectCommand } from "npm:@aws-sdk/client-s3";

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

// Lockere Prüfung: verbietet nur Slash und Backslash
function isSafeFileName(name: string) {
  return !name.includes("/") && !name.includes("\\");
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    const rawName = ctx.params.name;
    const name = decodeURIComponent(rawName);

    if (!isSafeFileName(name)) {
      return new Response("Ungültiger Dateiname", { status: 400 });
    }

    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: name,
      });

      const response = await s3.send(command);

      if (!response.Body) {
        return new Response("Datei nicht gefunden", { status: 404 });
      }

      // response.Body ist hier ein ReadableStream, das wird als Body der Response übergeben
      return new Response(response.Body as ReadableStream, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${name}"`,
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("PDF-Auslieferungsfehler:", error);
      return new Response("Datei nicht gefunden", { status: 404 });
    }
  },
};
