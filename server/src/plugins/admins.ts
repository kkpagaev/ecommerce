import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Admins } from "../core/admin/admin";

declare module "fastify" {
  export interface FastifyInstance {
    admins: Admins;
  }
}

export default fp(async function (f: FastifyInstance) {
  f.decorate("admins", Admins({
    pool: f.pool,
  }));
}, {
  name: "admin",
  dependencies: ["pool"],
});
