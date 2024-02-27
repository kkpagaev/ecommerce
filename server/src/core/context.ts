import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? "anonymous" };

  return { user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
