import { FastifyZod } from "fastify";

export default async ({ t, languages }: FastifyZod) => ({
  listLanguages: t.procedure
    .query(async () => {
      const res = await languages.list();

      return res;
    }),
});
