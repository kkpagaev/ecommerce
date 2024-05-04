import { FastifyZod } from "fastify";
import { Base64 } from "js-base64";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default async ({ t, fileUpload }: FastifyZod) => ({
  uploadFile: t.procedure
    .input(
      z.object({
        image: z.string().refine(Base64.isValid),
      })
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const imageMeta = await fileUpload.uploadFile(Buffer.from(input.image, "base64"));

      return imageMeta;
    }),
  listFiles: t.procedure
    .query(async ({ input }) => {
      return await fileUpload.list();
    }),
});
