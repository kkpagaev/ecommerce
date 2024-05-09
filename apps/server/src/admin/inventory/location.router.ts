import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default ({ t, inventory }: FastifyZod) => ({
  listLocations: t.procedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await inventory.locations.listLocations({
        name: input.name,
      });

      return res;
    }),

  createLocation: t.procedure
    .input(z.object({
      name: z.string(),
    }))
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await inventory.locations.createLocation({
        name: input.name,
      });

      return res;
    }),

  updateLocation: t.procedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
    }))

    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await inventory.locations.updateLocation(input.id, {
        name: input.name,
      });

      return res;
    }),

  deleteLocation: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await inventory.locations.deleteLocation(input.id);

      return res;
    }),

  findOneLocation: t.procedure
    .input(z.object({
      id: z.number(),

    }))
    .use(isAuthed)
    .query(async ({ input }) => {
      const res = await inventory.locations.findOneLocation({
        id: input.id,
      });

      return res;
    }),

});
