import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default async ({ t, catalog }: FastifyZod) => ({
  createAttribue: t.procedure
    .input(z.object({
      groupId: z.number(),
      descriptions: z.array(z.object({
        name: z.string(),
        languageId: z.number(),
      })),
    }).strict())
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await catalog.attributes.createAttribute({
        groupId: input.groupId,
        descriptions: input.descriptions,
      });

      return res;
    }),
  updateAttribute: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .input(z.object({
      descriptions: z.array(z.object({
        name: z.string(),
        languageId: z.number(),
      })),
    }).partial())
    .mutation(async ({ input }) => {
      const attributes = await catalog.attributes.updateAttribute(input.id, {
        descriptions: input.descriptions || [],
      });

      return attributes;
    }),
  findOneAttribute: t.procedure
    .input(z.object({
      id: z.number(),
    }).strict())
    .use(isAuthed)
    .query(async ({ input }) => {
      return await catalog.attributes.findOneAttribute(input);
    }),
});
