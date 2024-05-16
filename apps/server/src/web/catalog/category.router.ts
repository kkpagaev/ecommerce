import { FastifyZod } from "fastify";
import { z } from "zod";

export default async ({ t, catalog }: FastifyZod) => ({
  findCategory: t.procedure
    .input(
      z.object({
        slug: z.string(),
        languageId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const res = await catalog.categories.findCategoryBySlug({
        slug: input.slug,
        languageId: input.languageId,
      });

      return res;
    }),
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
