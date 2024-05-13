import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default ({ t, catalog: { productVariants } }: FastifyZod) => ({
  listProductVariantsOptions: t.procedure
    .input(
      z.object({
        languageId: z.number(),
        productVariantIds: z.array(z.number()),
      })
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await productVariants.listProductVariantsOptions({
        languageId: input.languageId,
        productVariantIds: input.productVariantIds,
      });

      return res;
    }),
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
      price: z.number().positive()
        .multipleOf(0.01),
      oldPrice: z.number().positive()
        .multipleOf(0.01),
      article: z.string(),
      discount: z.number(),
      popularity: z.number(),
      images: z.array(z.string()),
      barcode: z.string(),
      isActive: z.boolean(),
      slug: z.string(),
      productId: z.number(),
      options: z.array(z.number()),
      stockStatus: z.enum(["in_stock", "out_of_stock", "preorder"]),
      descriptions: z.array(z.object({
        languageId: z.number(),
        name: z.string(),
        shortDescription: z.string(),
      })),
    }))
    // .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await productVariants.createProductVariant({
        stockStatus: input.stockStatus,
        price: input.price,
        oldPrice: input.oldPrice,
        article: input.article,
        discount: input.discount,
        popularity: input.popularity,
        images: input.images,
        barcode: input.barcode,
        isActive: input.isActive,
        slug: input.slug,
        productId: input.productId,
        descriptions: input.descriptions,
        options: input.options,
      });

      return res;
    }),

  updateProductVariant: t.procedure
    .input(
      z.object({
        id: z.number(),
      }).and(z.object({
        price: z.number().positive()
          .multipleOf(0.01),
        oldPrice: z.number().positive()
          .multipleOf(0.01),
        article: z.string(),
        discount: z.number(),
        popularity: z.number(),
        images: z.array(z.string()),
        barcode: z.string(),
        isActive: z.boolean(),
        slug: z.string(),
        productId: z.number(),
        options: z.array(z.number()),
        stockStatus: z.enum(["in_stock", "out_of_stock", "preorder"]),
        descriptions: z.array(z.object({
          languageId: z.number(),
          name: z.string(),
          shortDescription: z.string(),
        })),
      }).partial())
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await productVariants.updateProductVariant(input.id, {
        price: input.price,
        oldPrice: input.oldPrice,
        article: input.article,
        discount: input.discount,
        popularity: input.popularity,
        stockStatus: input.stockStatus,
        images: input.images,
        barcode: input.barcode,
        isActive: input.isActive,
        slug: input.slug,
        descriptions: input.descriptions,
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
