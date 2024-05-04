import fp from "fastify-plugin";
import { LocalStorageProvider, Files } from "@repo/file-upload";

declare module "fastify" {
  export interface FastifyInstance {
    fileUpload: Files;
  }
}

export default fp(async function (f) {
  const pool = f.pool;
  const localFileStorageProvider = new LocalStorageProvider("./uploads", "http://localhost:3000/uploads");
  const files = new Files(localFileStorageProvider, pool);

  f.decorate("fileUpload", files);
}, {
  name: "file-upload",
  dependencies: ["pool"],
});
