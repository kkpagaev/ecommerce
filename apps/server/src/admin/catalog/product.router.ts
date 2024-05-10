import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default async ({ t, catalog }: FastifyZod) => ({
  listProducts: t.procedure
    .input(
      z.object({
        languageId: z.number(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await catalog.products.listProducts({
        languageId: input.languageId,
      });

      return res;
    }),
  createProduct: t.procedure
    .input(z.object({
      price: z.number().positive()
        .multipleOf(0.01),
      categoryId: z.number(),
      attributes: z.array(z.number()).optional(),
      images: z.array(z.string()),
      optionGroups: z.array(z.number()),
      options: z.array(z.number()).optional(),
      descriptions: z.array(z.object({
        name: z.string(),
        description: z.string(),
        languageId: z.number(),
      })),
    }))
    // .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await catalog.products.createProduct({
        options: input.options,
        attributes: input.attributes || [],
        images: input.images,
        optionGroups: input.optionGroups,
        price: input.price,
        categoryId: input.categoryId,
        descriptions: input.descriptions,
      });

      return res;
    }),
  updateProduct: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
        .and(
          z.object({
            price: z.number().positive()
              .multipleOf(0.01),
            images: z.array(z.string()),
            categoryId: z.number(),
            attributes: z.array(z.number()).optional(),
            options: z.array(z.number()).optional(),
            optionGroups: z.array(z.number()).optional(),
            descriptions: z.array(z.object({
              name: z.string(),
              description: z.string(),
              languageId: z.number(),
            })),
          }).partial()
        )
    )
    .mutation(async ({ input }) => {
      const res = await catalog.products.updateProduct(input.id, {
        categoryId: input.categoryId,
        attributes: input.attributes,
        images: input.images,
        optionGroups: input.optionGroups,
        options: input.options,
        descriptions: input.descriptions,
        price: input.price,
      });

      return res;
    }),
  findOneProduct: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const res = await catalog.products.findOneProduct({
        id: input.id,
      });

      return res;
    }),

});
