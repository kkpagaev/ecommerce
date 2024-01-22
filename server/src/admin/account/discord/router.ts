import { FastifyInstance } from "fastify";
import { publicProcedure } from "../../../trpc";

export default async function (f: FastifyInstance) {
  return f.trpc({
    foo: publicProcedure.query(() => "bar"),
  });
}
