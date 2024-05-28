import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Orders } from "@repo/orders";

declare module "fastify" {
  export interface FastifyInstance {
    orders: Orders;
  }
}

export default fp(async function (f: FastifyInstance) {
  f.decorate("orders", new Orders({
    pool: f.pool,
  }));
}, {
  dependencies: ["pool"],
});
