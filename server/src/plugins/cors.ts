import fastifyCors from "@fastify/cors";
import fp from "fastify-plugin";

export default fp(async function (f) {
  await f.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  });
});
