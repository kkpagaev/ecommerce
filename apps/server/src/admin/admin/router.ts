import { FastifyZod } from "fastify";
import { isAuthed } from "../../core/trpc";
import { z } from "zod";

export default async ({ t, admins }: FastifyZod) => ({
  listAdmins: t.procedure
    .use(isAuthed)
    .input(z.object({
      name: z.string().optional(),
      email: z.string().optional(),
    }).partial())
    .query(async ({ input }) => {
      const res = await admins.listAdmins({
        name: input.name,
        email: input.email,
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
    }))
    .mutation(async ({ input }) => {
      const admin = await admins.createAdmin({
        email: input.email,
        name: input.name,
        surname: input.surname,
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
    }))
    .mutation(async ({ input }) => {
      const res = await admins.updateAdmin(input.id, {
        email: input.email,
        name: input.name,
        surname: input.surname,
      });

      return res;
    }),
});
