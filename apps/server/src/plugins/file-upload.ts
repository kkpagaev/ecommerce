import fp from "fastify-plugin";
import { LocalStorageProvider, FileUploadProvider } from "@repo/file-upload";

declare module "fastify" {
  export interface FastifyInstance {
    fileUpload: FileUploadProvider;
  }
}

export default fp(async function (f) {
  const pool = f.pool;
  const localFileStorageProvider = new LocalStorageProvider("./uploads", "http://localhost:3000/uploads", pool);

  f.decorate("fileUpload", localFileStorageProvider);
}, {
  name: "file-upload",
  dependencies: ["pool"],
});
