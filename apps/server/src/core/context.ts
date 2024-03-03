import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { JwtPayload } from "./auth/jwt";

export async function createContext(
  handleAuth: (header: string) => Promise<JwtPayload | null>,
  { req }: CreateFastifyContextOptions
) {
  const user = req.headers.authorization ? await handleAuth(req.headers.authorization) : null;

  return { user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
