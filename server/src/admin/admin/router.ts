import { FastifyZod } from "fastify";
import { isAuthed } from "../../core/trpc";
import { z } from "zod";

export default async ({ t, admins }: FastifyZod) => ({
  listAdmins: t.procedure
    .use(isAuthed)
    .input(z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
    }).strict())
    .query(async ({ input }) => {
      const res = await admins.listAdmins({
        page: input.page,
        limit: input.limit,
      });

      return res;
    }),
  findOneAdmin: t.procedure
    .use(isAuthed)
    .input(z.object({
      id: z.number().int(),
      email: z.string().email(),
    }).partial()
    )
    .query(async ({ input }) => {
      const admin = await admins.findOneAdmin({
        id: input.id,
      });

      return admin;
    }),
  createAdmin: t.procedure
    .use(isAuthed)
    .input(z.object({
      name: z.string().optional(),
      surname: z.string().optional(),
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const admin = await admins.createAdmin({
        email: input.email,
        name: input.name,
        surname: input.surname,
        password: input.password,
      });

      return admin;
    }),
  updateAdmin: t.procedure
    .use(isAuthed)
    .input(z.object({
      id: z.number().int(),
      email: z.string().email(),
      name: z.string(),
      surname: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const res = await admins.updateAdmin(input.id, {
        email: input.email,
        name: input.name,
        surname: input.surname,
        password: input.password,
      });

      return res;
    }),
});
