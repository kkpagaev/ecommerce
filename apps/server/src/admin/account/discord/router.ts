import { FastifyZod } from "fastify";

export default ({ t }: FastifyZod) => ({
  foo: t.procedure.query(() => "bar"),
});
