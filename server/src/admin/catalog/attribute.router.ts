import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";
import { translationSchema } from "./category.router";

export default async ({ t, catalog }: FastifyZod) => ({
  createAttribue: t.procedure
    .input(z.object({
      name: translationSchema,
      values: z.array(z.object({
        value: translationSchema,
      })).optional(),
      description: translationSchema.optional(),
    }).strict())
    .use(isAuthed)
    .mutation(async ({ input }) => {
      const res = await catalog.attributes.createAttribute({
        description: input.description,
        values: input.values,
        name: input.name,
      });

      return res;
    }),
  updateAttribute: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .input(z.object({
      name: translationSchema,
      values: z.array(z.object({
        id: z.number().optional(),
        value: translationSchema,
      })),
      description: translationSchema,
    }).partial())
    .mutation(async ({ input }) => {
      const attributes = await catalog.attributes.updateAttribute(input.id, {
        description: input.description,
        values: input.values?.map((v) => ({
          id: v.id,
          value: v.value,
          attributeId: input.id,
        })),
        name: input.name,
      });

      return attributes;
    }),
  findOneAttribute: t.procedure
    .input(z.object({
      id: z.number(),
    }).strict())
    .use(isAuthed)
    .query(async ({ input }) => {
      return await catalog.attributes.findOneAttribute(input);
    }),
});
