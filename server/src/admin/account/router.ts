import { FastifyInstance } from "fastify";

export default async ({ t }: FastifyInstance) => ({
  foo: t.procedure.query(() => {
    return "foo";
  }),
});
