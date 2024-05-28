import { FastifyZod } from "fastify";
import { z } from "zod";

export default ({ t, orders }: FastifyZod) => ({
  listOrders: t.procedure
    .query(() => {
      return orders.listOrders();
    }),

  findOne: t.procedure
    .input(
      z.object({
        id: z.number(),
        languageId: z.number(),
      }),
    )
    .query(({ input }) => {
      return orders.findOne(input.id, input.languageId);
    }),
  changeStatus: t.procedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["cancelled", "created", "processing", "shipped"]),
      }),
    )
    .mutation(({ input }) => {
      return orders.changeStatus(input.id, input.status);
    }),
});
