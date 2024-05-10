import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Admins } from "@repo/admin";

declare module "fastify" {
  export interface FastifyInstance {
    admins: Admins;
  }
}

export default fp(async function (f: FastifyInstance) {
  const admins = new Admins({ pool: f.pool });

  f.decorate("admins", admins);
}, {
  name: "admin",
  dependencies: ["pool"],
});
