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
  f.get("/file-upload", async (req, rep) => {
    const imageId = (req.query as any).imageId as string;
    if (!imageId) {
      return rep.code(400).send({
        error: "imageId is required",
      });
    }

    const image = await files.findById(imageId);

    if (!image) {
      return rep.code(404).send({
        error: "image not found",
      });
    }

    return rep.redirect(image.url);
  });
}, {
  name: "file-upload",
  dependencies: ["pool"],
});
