import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { JwtService } from "../core/auth/jwt";

declare module "fastify" {
  export interface FastifyInstance {
    auth: JwtService;
  }
}

export default fp(async function (f: FastifyInstance) {
  f.decorate("auth", new JwtService("secret"));
}, {
  name: "auth",
});
