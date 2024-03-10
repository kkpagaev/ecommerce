import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default ({ languages, t }: FastifyZod) => ({
  create: t.procedure
    .input(z.object({
      name: z.string(),
    }))
    .mutation(async ({ input }) => {
      const lang = await languages.create({
        name: input.name,
      });

      return lang;
    }),

  update: t.procedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
    }))
    .mutation(async ({ input }) => {
      const lang = await languages.update(input.id, {
        name: input.name,
      });

      return lang;
    }),

  list: t.procedure
    .use(isAuthed)
    .query(async () => {
      const res = await languages.list();

      return res;
    }),

  find: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const res = await languages.get(input.id);

      return res;
    }),

  delete: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      const res = await languages.delete(input.id);

      return res;
    }),

});
