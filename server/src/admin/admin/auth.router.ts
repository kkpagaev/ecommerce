import { FastifyZod } from "fastify";

export default async ({ t, jwt }: FastifyZod) => ({
  signIn: t.procedure
    .mutation(async () => {
      const token = jwt.sign({
        userId: 1,
      });

      return token;
    }),
});
