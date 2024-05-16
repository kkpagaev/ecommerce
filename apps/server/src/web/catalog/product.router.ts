import { FastifyZod } from "fastify";
import { z } from "zod";

export default async ({ t, catalog }: FastifyZod) => ({
  filter: t.procedure
    .input(z.object({
      options: z.array(z.number()).optional(),
      attributes: z.array(z.number()).optional(),
      vendors: z.array(z.number()).optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
      categoryId: z.number().optional(),
      languageId: z.number(),
      asc: z.boolean().optional(),
      sort: z.enum(["price", "popularity"]).optional(),
    }))
    .query(async ({ input }) => {
      const filters = await catalog.productFiltering.getFilters({
        category: {
          id: input.categoryId,
        },
        languageId: input.languageId,
      });
      const vendors = await catalog.vendors.list();
      const limit = input.limit || 20;

      const products = await catalog.productFiltering.paginateVariants({
        order: input.sort || "popularity",
        asc: input.asc || false,
        limit: limit,
        offset: (limit * (input.page || 1)) - limit,
        categoryId: input.categoryId,
        options: input.options || [],
        attributes: input.attributes || [],
        languageId: input.languageId,
        vendors: input.vendors || [],
      });

      return {
        vendors,
        filters,
        data: products,
      };
    }),

  findProduct: t.procedure
    .input(z.object({
      slug: z.string(),
      languageId: z.number(),
    }))
    .query(async ({ input }) => {
      const res = await catalog.productVariants.productVariantView({
        languageId: input.languageId,
        slug: input.slug,
      });

      return res;
    }),
});
