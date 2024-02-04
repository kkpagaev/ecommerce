import { FastifyInstance } from "fastify";

export default ({ t }: FastifyInstance) => ({
  foo: t.procedure.query(() => "bar"),
});
