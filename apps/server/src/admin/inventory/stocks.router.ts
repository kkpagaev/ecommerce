import { z } from "zod";
import { isAuthed } from "../../core/trpc";
import { FastifyZod } from "fastify";

export default ({ t, inventory }: FastifyZod) => ({
  productListStocks: t.procedure
    .input(
      z.object({
        name: z.string().optional(),
        languageId: z.number(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await inventory.stocks.productListStocks({
        name: input.name,
        languageId: input.languageId,
      });

      return res;
    }),
  getProductVariantStocks: t.procedure
    .input(
      z.object({
        productId: z.number(),
        languageId: z.number(),
      })
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await inventory.stocks.productVariantListStocks({
        productId: input.productId,
      });

      return res;
    }),

  upsertStock: t.procedure
    .input(
      z.array(
        z.object({
          locationId: z.number(),
          productVariantId: z.number(),
          count: z.number(),
        })
      )
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await inventory.stocks.upsertStocks(
        input.map(
          (s) => ({
            count: s.count,
            locationId: s.locationId,
            productVariantId: s.productVariantId,
          })
        )
      );

      return res;
    }),

});
