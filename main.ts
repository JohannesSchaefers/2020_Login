/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { S3Client, ListObjectsV2Command, ListBucketsCommand, _Object as ObjectSummary } from "@aws-sdk/client-s3";

// Fetch environment variables directly with Deno.env.get
const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
const endpoint = Deno.env.get("R2_ENDPOINT");
const bucketName = Deno.env.get("R2_BUCKET_NAME");

// Debugging: log raw environment values
console.log("R2_ACCESS_KEY_ID (raw):", accessKeyId);
console.log("R2_SECRET_ACCESS_KEY (raw):", secretAccessKey);
console.log("R2_ENDPOINT (raw):", endpoint);
console.log("R2_BUCKET_NAME (raw):", bucketName);

// Check if environment variables are valid
function checkEnvVar(variable: string | undefined, name: string): void {
  if (!variable?.trim()) {
    console.error(`Fehler: ${name} ist nicht gesetzt oder leer`);
    throw new Error(`${name} fehlt`);
  }
}

// Validate environment variables
checkEnvVar(accessKeyId, "R2_ACCESS_KEY_ID");
checkEnvVar(secretAccessKey, "R2_SECRET_ACCESS_KEY");
checkEnvVar(endpoint, "R2_ENDPOINT");
checkEnvVar(bucketName, "R2_BUCKET_NAME");

// Initialize S3Client with credentials and endpoint
const s3Client = new S3Client({
  region: "auto",
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

// Log S3 client initialization
console.log("S3 Client successfully initialized.");

// Example: List all available buckets
async function listBuckets() {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log("Buckets:", response.Buckets?.map((bucket) => bucket.Name));
  } catch (error) {
    console.error("Error listing buckets:", error);
  }
}

// Call the listBuckets function to test
await listBuckets();

// Function to list PDF files in a given bucket
export async function listPDFFiles(bucketName: string): Promise<string[]> {
  console.log("R2_ENDPOINT:", endpoint);
  console.log("R2_BUCKET_NAME:", bucketName);
  console.log("R2_ACCESS_KEY_ID:", accessKeyId);

  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3Client.send(command);
    console.log("Bucket-Inhalt:", response.Contents?.map(obj => obj.Key) || []);

    return (
      response.Contents?.filter((obj: ObjectSummary) =>
        obj.Key && obj.Key.endsWith(".pdf")
      ).map((obj: ObjectSummary) => obj.Key!) || []
    );
  } catch (error) {
    console.error("Fehler beim Abrufen der Dateien aus R2:", error);
    throw error;
  }
}
