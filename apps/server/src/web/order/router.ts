import { FastifyZod } from "fastify";
import { z } from "zod";

const model = z.object({
  ref: z.string(),
  description: z.string(),
});
export default ({ t, orders }: FastifyZod) => ({
  create: t.procedure
    .input(
      z.object({
        details: z.object({
          warehouse: model,
          city: model,
          area: model,
          name: z.string(),
          surname: z.string(),
          email: z.string().email(),
          phone: z.string(),
          description: z.string(),
        }),
        productVariants: z.array(z.object({
          id: z.number(),
          quantity: z.number(),
        })),
      })
    )
    .mutation(async (opts) => {
      const order = await orders.createOrder({
        details: opts.input.details,
        productVariants: opts.input.productVariants,
      });

      return order;
    }),
});
