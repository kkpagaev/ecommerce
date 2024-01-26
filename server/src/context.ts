import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? "anonymous" };
  console.log({ req: req.url });

  // check if params is an object with params.path
  // params.path is trpc path
  if (
    typeof req.params !== "object" ||
    req.params === null ||
    Array.isArray(req.params) ||
    !("path" in req.params) ||
    typeof req.params.path !== "string"
  ) {
    return { req, res, user };
  }

  if (!req.params.path.endsWith("serverValidate")) {
    return { req, res, user };
  }
  const path = req.params.path;

  const trpcPath = path.split(".");

  // inserts validate before the lastt element
  // so when we call like category.createCategory.serverValidate
  // we "redirect" it to category.validate.createCategory
  const len = trpcPath.length;
  [trpcPath[len - 2], trpcPath[len - 1]] = ["validate", trpcPath[len - 2]];

  const foo = trpcPath.join(".");
  req.params.path = foo;

  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
