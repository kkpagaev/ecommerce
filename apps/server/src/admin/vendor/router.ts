import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default ({ catalog: { vendors }, t }: FastifyZod) => ({
  create: t.procedure
    .input(z.object({
      name: z.string(),
    }))
    .mutation(async ({ input }) => {
      const lang = await vendors.create({
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
      const lang = await vendors.update(input.id, {
        name: input.name,
      });

      return lang;
    }),

  list: t.procedure
    .use(isAuthed)
    .query(async () => {
      const res = await vendors.list();

      return res;
    }),

  find: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const res = await vendors.get(input.id);

      return res;
    }),

  delete: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      const res = await vendors.delete(input.id);

      return res;
    }),

});
