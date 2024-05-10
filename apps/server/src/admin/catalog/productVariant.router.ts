import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default ({ t, catalog: { productVariants } }: FastifyZod) => ({
  listProductVariants: t.procedure
    .input(
      z.object({
        languageId: z.number(),
        productId: z.number(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await productVariants.listProductVariants({
        languageId: input.languageId,
        productId: input.productId,
      });

      return res;
    }),

  findProductVariant: t.procedure
    .input(
      z.object({
        id: z.number(),
        languageId: z.number(),
      })
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await productVariants.findOneProductVariant({
        languageId: input.languageId,
        variantId: input.id,
      });

      return res;
    }),
  createProductVariant: t.procedure
    .input(z.object({
      productId: z.number(),
      options: z.array(z.number()),
    }))
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await productVariants.createProductVariant({
        productId: input.productId,
        options: input.options,
      });

      return res;
    }),

  updateProductVariant: t.procedure
    .input(
      z.object({
        id: z.number(),
      }).and(z.object({
        options: z.array(z.number()),
      }).partial())
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await productVariants.updateProductVariant(input.id, {
        options: input.options,
      });

      return res;
    }),

  deleteProductVariant: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await productVariants.deleteProductVariant(input.id);

      return res;
    }),
});
