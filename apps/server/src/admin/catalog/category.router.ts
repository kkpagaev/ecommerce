import { z } from "zod";
import { FastifyZod } from "fastify";
import { isAuthed } from "../../core/trpc";

export default async ({ t, catalog }: FastifyZod) => ({
  listCategories: t.procedure
    .input(
      z.object({
        languageId: z.number(),
        name: z.string().optional(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await catalog.categories.listCategories({
        languageId: input.languageId,
        name: input.name,
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
        imageId: z.string().uuid().optional(),
        parentId: z.number().optional(),
        descriptions: z.array(z.object({
          name: z.string().min(1),
          languageId: z.number(),
        })),
      }),
    )
    .mutation(async ({ input }) => {
      const category = await catalog.categories.createCategory({
        parentId: input.parentId,
        imageId: input.imageId,
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
          parentId: z.number().optional(),
          imageId: z.string().uuid().optional(),
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
        parentId: input.parentId,
        imageId: input.imageId,
      });

      return foo;
    }),
});
