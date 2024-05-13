import { FastifyZod } from "fastify";
import { z } from "zod";

export default async ({ t, catalog }: FastifyZod) => ({
  filter: t.procedure
    .input(z.object({
      options: z.array(z.number()).optional(),
      attributes: z.array(z.number()).optional(),
      categoryId: z.number().optional(),
      languageId: z.number(),
    }))
    .query(async ({ input }) => {
      const filters = await catalog.productFiltering.getFilters({
        languageId: input.languageId,
        options: input.options || [],
        attributes: input.attributes || [],
      });
      const products = await catalog.products.paginate({
        options: input.options || [],
        attributes: input.attributes || [],
        languageId: input.languageId,
      })

      return {
        filters,
        data: products,
      };
    }),
});
