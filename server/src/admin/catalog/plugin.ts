import { FastifyZod } from "fastify";
import { z } from "zod";

export default function (f: FastifyZod) {
  f.get("/test", {
    schema: {
      body: z.object({
        test: z.string(),
      }),
    },
  }, async (req) => {
    return req.body;
  });
}
