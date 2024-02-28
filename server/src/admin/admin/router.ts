import { FastifyZod } from "fastify";
import { isAuthed } from "../../core/trpc";
import { z } from "zod";

export default async ({ t, admins }: FastifyZod) => ({
  findOneAdmin: t.procedure
    .use(isAuthed)
    .input(z.object({
      id: z.number().int(),
      email: z.string().email(),
    }).partial()
    )
    .query(async ({ input }) => {
      const admin = await admins.findOneAdmin({
        id: input.id,
      });

      return admin;
    }),

});
