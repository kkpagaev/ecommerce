import { z } from "zod";
import slugify from "slugify";
import { FastifyZod } from "fastify";

export default async ({ pool, t, catalog }: FastifyZod) => ({
  listCategories: t.procedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(15),
        name: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const res = await catalog.categories.listCategories(input);

      return res;
    }),

  findCategoryById: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await catalog.categories.getCategoryById(input.id);
    }),

  createCategory: t.procedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const category = await catalog.categories.createCategory(input);

      return category;
    }),

  updateCategory: t.procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      }).partial()
    )
    .mutation(async ({ input }) => {
      const foo = await createCategory.run(
        {
          name: input.name,
          description: input.description,
          slug: input.name,
        },
        pool,
      );

      return foo;
    }),
});
