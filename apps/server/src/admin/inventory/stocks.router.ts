import { z } from "zod";
import { isAuthed } from "../../core/trpc";
import { FastifyZod } from "fastify";

export default ({ t, inventory }: FastifyZod) => ({
  listStocks: t.procedure
    .input(
      z.object({
        limit: z.number().optional(),
        page: z.number().optional(),
        productId: z.number().optional(),
        optionId: z.number().optional(),
        locationId: z.number().optional(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await inventory.stocks.listStocks({
        limit: input.limit,
        page: input.page,
        productId: input.productId,
        optionId: input.optionId,
        locationId: input.locationId,
      });

      return res;
    }),

  getProductStocks: t.procedure
    .input(
      z.array(
        z.object({
          productId: z.number(),
          optionId: z.number(),
        }),
      )
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      return await inventory.stocks.getProductStocks(input);
    }),
});
