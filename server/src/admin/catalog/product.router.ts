import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";
import { translationSchema } from "./category.router";

export default async ({ t, catalog }: FastifyZod) => ({
  listProducts: t.procedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(15),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await catalog.products.listProducts(input);

      return res;
    }),
  createProduct: t.procedure
    .input(z.object({
      name: translationSchema,
      // 0.01
      price: z.number().positive()
        .multipleOf(0.01),
      categoryId: z.number(),
      attributes: z.array(z.number()).optional(),
      description: translationSchema.optional(),
    }))
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await catalog.products.createProduct({
        name: input.name,
        price: input.price,
        categoryId: input.categoryId,
        attributes: input.attributes,
        description: input.description,
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
            name: translationSchema,
            price: z.number().positive()
              .multipleOf(0.01),
            categoryId: z.number(),
            attributes: z.array(z.number()).optional(),
            description: translationSchema.optional(),
          }).partial()
        )
    )
    .mutation(async ({ input }) => {
      const res = await catalog.products.updateProduct(input.id, {
        description: input.description,
        categoryId: input.categoryId,
        attributes: input.attributes,
        name: input.name,
        price: input.price,
      });

      return res;
    }),

});
