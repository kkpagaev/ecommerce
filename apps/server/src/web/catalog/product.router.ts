import { FastifyZod } from "fastify";
import { z } from "zod";

export default async ({ t, catalog }: FastifyZod) => ({
  filter: t.procedure
    .input(z.object({
      options: z.array(z.number()),
      attributes: z.array(z.number()),
    }).partial())
    .query(async ({ input }) => {
      return await catalog.productFiltering.getFilters({
        options: input.options || [],
        attributes: input.attributes || [],
      });
    }),
});
