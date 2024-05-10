import { z } from "zod";
import { isAuthed } from "../../core/trpc";
import { FastifyZod } from "fastify";

export default ({ t, inventory }: FastifyZod) => ({
  productListStocks: t.procedure
    .input(
      z.object({
        languageId: z.number(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await inventory.stocks.productListStocks({
        languageId: input.languageId,
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
      // return await inventory.stocks.getProductStocks(input);
    }),
});
