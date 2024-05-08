import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default async ({ t, catalog: { options } }: FastifyZod) => ({
  createOption: t.procedure
    .use(isAuthed)
    .input(z.object({
      type: z.enum(["color", "size", "text"]),
      groupId: z.number(),
      descriptions: z.array(z.object({
        name: z.string(),
        languageId: z.number(),
      })),
      value: z.record(z.any()),
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
          type: z.enum(["color", "size", "text"]),
          descriptions: z.array(z.object({
            name: z.string(),
            languageId: z.number(),
          })),
          value: z.record(z.any()),
        }).partial()
      )
    )
    .mutation(async ({ input }) => {
      const option = await options.updateOption(input.id, {
        value: input.value,
        descriptions: input.descriptions,
      });

      return option;
    }),

  listOptions: t.procedure
    .input(
      z.object({
        languageId: z.number(),
        groupId: z.number().optional(),
      })
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await options.listOptions({
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
