import { FastifyZod } from "fastify";
import { z } from "zod";

export default async ({ t, catalog }: FastifyZod) => ({
  listCategoriesForHeader: t.procedure
    .input(
      z.object({
        languageId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const res = await catalog.categories.listCategories({
        languageId: input.languageId,
      });

      return res;
    }),
});
