import { FastifyZod } from "fastify";
import { z } from "zod";

export default async ({ t, catalog }: FastifyZod) => ({
  listProducts: t.procedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(15),
      }),
    )
    .query(async ({ input }) => {
      const res = await catalog.products.listProducts(input);

      return res;
    }),
});
