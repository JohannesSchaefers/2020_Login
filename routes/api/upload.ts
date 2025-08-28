

/*
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
*/

import { Handlers } from "$fresh/server.ts";
import {
S3Client,
PutObjectCommand,
HeadObjectCommand,
} from "npm:@aws-sdk/client-s3";
// These secrets must come from environment variables in Deno Deploy
const BUCKET = "2020-rechnungen";
//const ENDPOINT = "https://a472768f5dff0e95af7610729ca9c462.r2.cloudflarestorage.com"; //

const ENDPOINT = "https://a472768f5dff0e95af7610729ca9c462.eu.r2.cloudflarestorage.com";

const REGION = "weur";
const ACCESS_KEY_ID = Deno.env.get("R2_ACCESS_KEY_ID");
const SECRET_ACCESS_KEY = Deno.env.get("R2_SECRET_ACCESS_KEY");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const s3 = new S3Client({
region: REGION,
endpoint: ENDPOINT,
credentials: {
accessKeyId: ACCESS_KEY_ID!,
secretAccessKey: SECRET_ACCESS_KEY!,
},
forcePathStyle: true,
});
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
if (file.size > MAX_FILE_SIZE) {
return Response.redirect(
new URL("/?error=Datei zu groß (max 10MB)", req.url),
303,
);
}
// Sanitize file name
const safeName = file.name.replaceAll("/", "_").replaceAll("\\", "_");
let fileName = safeName;
let counter = 1;
// Check if file exists in bucket, add suffix if necessary
while (await existsInBucket(fileName)) {
const dotIndex = safeName.lastIndexOf(".");
const base = dotIndex === -1 ? safeName : safeName.slice(0, dotIndex);
const ext = dotIndex === -1 ? "" : safeName.slice(dotIndex);
fileName = `${base}-${counter++}${ext}`;
}
// Upload to R2 bucket
const bytes = new Uint8Array(await file.arrayBuffer());
await s3.send(
new PutObjectCommand({
Bucket: BUCKET,
Key: fileName,
Body: bytes,
ContentType: "application/pdf",
}),
);
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
async function existsInBucket(path: string) {
try {
await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: path }));
return true;
} catch {
return false;
}
}
