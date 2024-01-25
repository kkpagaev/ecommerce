import { z } from "zod";
import { FastifyInstance } from "fastify";
import {
  listCategories,
  createCategory,
  findCategoryById,
  listCategoriesCount,
} from "./category.queries";

export default async function (f: FastifyInstance) {
  const { publicProcedure, trpc, pool } = f;

  return trpc({
    foo: publicProcedure
      // .input(z.object({ foo: z.string() }))
      .query(() => "bar"),
    listCategories: publicProcedure
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
    findCategoryById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await findCategoryById.run({ id: input.id }, pool);
      }),
    createCategory: publicProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          email: z.string().email(),
        }),
      )
      .mutation(async ({ input }) => {
        const category = await createCategory.run(
          {
            name: input.name,
            description: input.description,
          },
          pool,
        );

        return category;
      }),
    updateCategory: publicProcedure
      .input(
        z
          .object({
            name: z.string(),
            description: z.string(),
          })
          .partial(),
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
}
