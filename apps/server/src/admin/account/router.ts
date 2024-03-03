import { FastifyZod } from "fastify";

export default async ({ t }: FastifyZod) => ({
  foo: t.procedure.query(() => {
    return "foo";
  }),
});
