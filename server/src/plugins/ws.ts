import fp from "fastify-plugin";
import { fastifyWebsocket } from "@fastify/websocket";

export default fp(async function (f) {
  await f.register(fastifyWebsocket);
}, {
  name: "ws",
});
