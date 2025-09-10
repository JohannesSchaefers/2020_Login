import { HandlerContext } from "$fresh/server.ts";
import { listBuckets } from "../../lib/s3.ts";

export const handler = {
  async GET(_req: Request, _ctx: HandlerContext) {
    try {
      const buckets = await listBuckets();
      return new Response(JSON.stringify(buckets), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("S3 Error:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
