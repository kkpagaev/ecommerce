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
        languageId: z.number(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await catalog.categories.listCategories({
        limit: input.limit,
        languageId: input.languageId,
        page: input.page,
      });

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
        descriptions: z.array(z.object({
          name: z.string(),
          languageId: z.number(),
        })),
      }),
    )
    .mutation(async ({ input }) => {
      const category = await catalog.categories.createCategory({
        descriptions: input.descriptions,
      });

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
          descriptions: z.array(z.object({
            name: z.string(),
            languageId: z.number(),
          })),
        }).partial()
      )
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const id = input.id;
      const foo = await catalog.categories.updateCategory(id, {
        descriptions: input.descriptions,
      });

      return foo;
    }),
});
