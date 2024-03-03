import { z } from "zod";
import { FastifyZod } from "fastify";
import { isAuthed } from "../../core/trpc";

export const translationSchema = z.object({
  uk: z.string(),
  ru: z.string(),
  en: z.string(),
}).strict();

export default async ({ t, catalog }: FastifyZod) => ({
  listCategories: t.procedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(15),
        name: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const res = await catalog.categories.listCategories(input);

      return res;
    }),

  findCategoryById: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await catalog.categories.findCategoryById(input.id);
    }),

  createCategory: t.procedure
    .input(
      z.object({
        name: translationSchema,
        description: translationSchema.optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const category = await catalog.categories.createCategory(input);
      // ctx.user;

      return category;
    }),

  updateCategory: t.procedure
    .input(
      z.object(
        {
          id: z.number(),
        }
      ).and(
        z.object({
          name: translationSchema,
          description: translationSchema,
        }).partial()
      )
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const id = input.id;
      const foo = await catalog.categories.updateCategory(id, input);

      return foo;
    }),
});
