import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Languages } from "@repo/languages";

declare module "fastify" {
  export interface FastifyInstance {
    languages: Languages;
  }
}

export default fp(async function (f: FastifyInstance) {
  f.decorate("languages", new Languages({
    pool: f.pool,
  }));
}, {
  name: "languages",
  dependencies: ["pool"],
});
