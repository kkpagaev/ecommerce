import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { JwtService } from "../core/auth/jwt";

declare module "fastify" {
  export interface FastifyInstance {
    jwt: JwtService;
  }
}

export default fp(async function (f: FastifyInstance) {
  f.decorate("jwt", new JwtService("secret"));
}, {
  name: "auth",
});
