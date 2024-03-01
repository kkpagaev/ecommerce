import { FastifyZod } from "fastify";

export default async ({ t, auth }: FastifyZod) => ({
  signIn: t.procedure
    .mutation(async () => {
      const token = auth.sign({
        userId: 1,
      });

      return token;
    }),
});
