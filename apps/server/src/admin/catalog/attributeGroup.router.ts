import { FastifyZod } from "fastify";
import { z } from "zod";

export default ({ catalog, t }: FastifyZod) => ({
  listAttributeGroups: t.procedure
    .input(z.object({
      languageId: z.number(),
      name: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const res = await catalog.attributeGroups.listAttributeGroups({
        languageId: input.languageId,
        name: input.name,
      });

      return res;
    }),
  createAttributeGroup: t.procedure
    .input(z.object({
      descriptions: z.array(z.object({
        name: z.string().min(1),
        languageId: z.number(),
        description: z.string().nullable(),
      })),

    })).mutation(async ({ input }) => {
      return catalog.attributeGroups.createAttributeGroup({
        sortOrder: 0,
        descriptions: input.descriptions.map((d) => {
          return {
            name: d.name,
            languageId: d.languageId,
            description: d.description === "" ? null : d.description,
          };
        }),
      });
    }),

  updateAttributeGroup: t.procedure
    .input(z.object({
      id: z.number(),
      descriptions: z.array(z.object({
        name: z.string().min(1),
        languageId: z.number(),
        description: z.string().nullable(),
      })),
    }))
    .mutation(async ({ input }) => {
      return catalog.attributeGroups.updateAttributeGroup(
        input.id,
        {
          descriptions: input.descriptions.map((d) => {
            return {
              name: d.name,
              languageId: d.languageId,
              description: d.description === "" ? null : d.description,
            };
          }),
        });
    }),

  findOneAttributeGroup: t.procedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const group = catalog.attributeGroups.findOneAttributeGroup({
        id: input.id,
      });

      return group;
    }),
});
