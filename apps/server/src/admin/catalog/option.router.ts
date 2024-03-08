import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default async ({ t, catalog: { options } }: FastifyZod) => ({
  createOption: t.procedure
    .use(isAuthed)
    .input(z.object({
      groupId: z.number(),
      descriptions: z.array(z.object({
        name: z.string(),
        languageId: z.number(),
      })),
      value: z.string(),
    })).mutation(async ({ input }) => {
      const option = await options.createOption({
        descriptions: input.descriptions,
        value: input.value,
        groupId: input.groupId,
      });

      return option;
    }),

  updateOption: t.procedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.number(),
      }).and(
        z.object({
          groupId: z.number(),
          descriptions: z.array(z.object({
            name: z.string(),
            languageId: z.number(),
          })),
          value: z.string(),
        }).partial()
      )
    )
    .mutation(async ({ input }) => {
      const option = await options.updateOption(input.id, {
        value: input.value,
        descriptions: input.descriptions,
        groupId: input.groupId,
      });

      return option;
    }),

  listOptions: t.procedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(15),
        languageId: z.number(),
        groupId: z.number().optional(),
      })
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await options.listOptions({
        page: input.page,
        limit: input.limit,
        languageId: input.languageId,
        groupId: input.groupId,
      });

      return res;
    }),

  findOneOption: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const opt = await options.findOneOption({
        id: input.id,
      });

      return opt;
    }),

  deleteOption: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await options.deleteOption(input.id);

      return res;
    }),
});