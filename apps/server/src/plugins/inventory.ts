import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Locations } from "@repo/inventory";

type Inventory = {
  locations: Locations;
};

declare module "fastify" {
  export interface FastifyInstance {
    inventory: Inventory;
  }
}

export default fp(async function (f: FastifyInstance) {
  const locations = new Locations(f);

  f.decorate("inventory", {
    locations,
  });
}, {
  dependencies: ["pool"],
});
