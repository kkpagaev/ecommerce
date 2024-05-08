import { FastifyZod } from "fastify";
import { isAuthed } from "../../core/trpc";
import { z } from "zod";

export default ({ t, catalog: { optionGroups } }: FastifyZod) => ({
  createOptionGroup: t.procedure
    .use(isAuthed)
    .input(z.object({
      type: z.enum(["color", "size", "text"]),
      descriptions: z.array(z.object({
        name: z.string(),
        languageId: z.number(),
        description: z.string().optional(),
      }).strict()),
    }))
    .mutation(async ({ input }) => {
      const res = await optionGroups.createOptionGroup({
        type: input.type,
        descriptions: input.descriptions,
      });

      return res;
    }),

  updateOptionGroup: t.procedure
    .use(isAuthed)
    .input(z.object({
      id: z.number(),
    }).and(
      z.object({
        type: z.enum(["color", "size", "text"]),
        descriptions: z.array(z.object({
          name: z.string(),
          languageId: z.number(),
          description: z.string().optional(),
        }).strict()),
      }).partial()
    ))
    .mutation(async ({ input }) => {
      const res = await optionGroups.updateOptionGroup(
        input.id,
        {
          type: input.type,
          descriptions: input.descriptions,
        }
      );

      return res;
    }),
  findOptionGroup: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .use(isAuthed)
    .query(async ({ input }) => {
      return await optionGroups.findOptionGroup({
        id: input.id,
      });
    }),
  listOptionGroups: t.procedure
    .input(
      z.object({
        name: z.string().optional(),
        languageId: z.number(),
      })
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await optionGroups.list({
        languageId: input.languageId,
        name: input.name,
      });

      return res;
    }),
});
