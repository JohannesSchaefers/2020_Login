/*
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
*/
import { Handlers } from "$fresh/server.ts";
import { S3Client, DeleteObjectCommand } from "npm:@aws-sdk/client-s3";

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
      await s3.send(new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: name,
      }));
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

