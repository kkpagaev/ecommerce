import { z } from "zod";
import slugify from "slugify";
import {
  listCategories,
  createCategory,
  findCategoryById,
  listCategoriesCount,
} from "./category.queries";
import { FastifyZod } from "fastify";

export default async ({ pool, t, catalog }: FastifyZod) => ({
  foo: t.procedure.query(() => catalog.foo),
  listCategories: t.procedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(15),
        name: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const res = await listCategories.run(
        {
          page: input.page,
          limit: input.limit,
        },
        pool,
      );
      const count = await listCategoriesCount.run(undefined, pool);

      return {
        data: res,
        count: +(count[0].count ?? 0),
      };
    }),

  findCategoryById: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await findCategoryById.run({ id: input.id }, pool);
    }),

  createCategory: t.procedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.name);
      const category = await createCategory.run(
        {
          name: input.name,
          slug: slug,
          description: input.description,
        },
        pool,
      );

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
