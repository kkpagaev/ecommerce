import fp from "fastify-plugin";
import { PromGenerator, HotlineGenerator } from "@repo/exports";

type Exports = {
  prom: PromGenerator;
  hotline: HotlineGenerator;
};

declare module "fastify" {
  export interface FastifyInstance {
    exports: Exports;
  }
}

export default fp(async function (f) {
  const prom = new PromGenerator();
  const hotline = new HotlineGenerator();

  f.decorate("exports", {
    prom: prom,
    hotline: hotline,
  });
}, {
  name: "exports",
});
