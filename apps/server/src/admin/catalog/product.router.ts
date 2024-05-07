import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";
import { translationSchema } from "./category.router";

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
      name: translationSchema,
      price: z.number().positive()
        .multipleOf(0.01),
      categoryId: z.number(),
      attributes: z.array(z.number()).optional(),
      descriptions: z.array(z.object({
        name: z.string(),
        description: z.string(),
        languageId: z.number(),
      })),
    }))
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await catalog.products.createProduct({
        attributes: input.attributes || [],
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
            name: translationSchema,
            price: z.number().positive()
              .multipleOf(0.01),
            categoryId: z.number(),
            attributes: z.array(z.number()).optional(),
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
