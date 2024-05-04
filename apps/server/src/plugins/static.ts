import { FastifyInstance } from "fastify";
import * as path from "path";
import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";

export default fp(async function (f: FastifyInstance) {
  f.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "uploads"),
    prefix: "/uploads/",
  });
}, {
  name: "auth",
});
