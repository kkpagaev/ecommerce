import fp from "fastify-plugin";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";

export default fp(async function (f) {
  f.setValidatorCompiler(validatorCompiler);
  f.setSerializerCompiler(serializerCompiler);
}, {
  name: "zod",
});
