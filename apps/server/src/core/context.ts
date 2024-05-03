import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { JwtPayload } from "./auth/jwt";
import { FastifyRequest } from "fastify";
import { User } from "@clerk/fastify";

export async function createContext(
  handleAuth: (req: FastifyRequest) => Promise<User | null>,
  { req }: CreateFastifyContextOptions
) {
  const user = req.headers.authorization ? await handleAuth(req) : null;

  return { user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
