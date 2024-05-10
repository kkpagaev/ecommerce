import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Locations, Stocks } from "@repo/inventory";

type Inventory = {
  locations: Locations;
  stocks: Stocks;
};

declare module "fastify" {
  export interface FastifyInstance {
    inventory: Inventory;
  }
}

export default fp(async function (f: FastifyInstance) {
  const locations = new Locations(f);
  const stocks = new Stocks(f);

  f.decorate("inventory", {
    locations,
    stocks,
  });
}, {
  dependencies: ["pool"],
});
