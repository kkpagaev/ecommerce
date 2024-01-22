import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { FastifyInstance } from "fastify";

type User = {
  id: number;
  name: string;
  bio?: string;
};

const users: Record<string, User> = {};

export default async function (f: FastifyInstance) {
  return f.trpc({
    getUserById: publicProcedure
      .input(z.number()) // input type is string
      .query((opts) => {
        return users[opts.input]; // input type is string
      }),
    createUser: publicProcedure
      .input(
        z.object({
          name: z.string().min(3),
          bio: z.string().max(142).optional(),
        }),
      )
      .mutation((opts) => {
        const id = +Date.now().toString();
        const user: User = { id, ...opts.input };

        users[user.id] = user;

        return user;
      }),
  });
}
