import { FastifyZod } from "fastify";
import { isAuthed } from "../../core/trpc";
import { z } from "zod";

export default ({ t, catalog: { optionGroups } }: FastifyZod) => ({
  createOptionGroup: t.procedure
    .use(isAuthed)
    .input(z.object({
      type: z.enum(["color", "size", "text"]),
      sortOrder: z.number(),
      descriptions: z.array(z.object({
        name: z.string(),
        languageId: z.number(),
        description: z.string().optional(),
      }).strict()),
    }))
    .mutation(async ({ input }) => {
      const res = await optionGroups.createOptionGroup({
        type: input.type,
        sortOrder: input.sortOrder,
        descriptions: input.descriptions,
      });

      return res;
    }),
});
