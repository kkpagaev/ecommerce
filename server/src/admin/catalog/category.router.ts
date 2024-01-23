import { z } from "zod";
import { FastifyInstance } from "fastify";
import {
  listCategories,
  createCategory,
  findCategoryById,
} from "./category.queries";

export default async function (f: FastifyInstance) {
  const { publicProcedure, trpc, pool } = f;

  return trpc({
    listCategories: publicProcedure.query(async () => {
      const res = await listCategories.run(undefined, pool);
      console.log(res);
      return res;
    }),
    findCategoryById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await findCategoryById.run({ id: input.id }, pool);
      }),
    createCategory: publicProcedure
      .input(z.object({ name: z.string(), description: z.string().optional() }))
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
          },
          pool,
        );

        return foo;
      }),
  });
}
