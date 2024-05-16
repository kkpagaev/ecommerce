import { FastifyZod } from "fastify";
import { z } from "zod";
import { isAuthed } from "../../core/trpc";

export default ({ t, catalog, exports }: FastifyZod) => ({
  export: t.procedure.input(z.object({
    variantIds: z.array(z.number()),
    languageId: z.number(),
    firmName: z.string(),
    marketPlace: z.enum(["prom", "hotline"]),
  }))
    // .use(isAuthed)
    .mutation(async ({ input }) => {
      if (input.marketPlace === "hotline") {
        // type Product = {
        //   id: number;
        //   categoryId: number;
        //   code?: string;
        //   barcode?: string;
        //   vendor: string;
        //   name: string;
        //   description?: string;
        //   url: string;
        //   image?: string;
        //   priceRUAH: number;
        //   priceRUSD?: number;
        //   stock: "В наявності" | "Під замовлення" | "Немає";
        //   region?: string;
        //   params?: {
        //     name: string;
        //     value: string;
        //   }[];
        //   condition?: 0 | 1 | 2 | 3;
        const productVariants = await catalog.productVariants.listAll({
          languageId: input.languageId,
        });
        const res = exports.hotline.generate({
          date: new Date(),
          categories: await catalog.categories.listCategories({
            languageId: input.languageId,
          }),
          rate: 1,
          firmName: input.firmName,
          products: productVariants.map((p) => ({
            image: p.images[0] ?? null,
            url: "http://example.com/products/" + p.slug,
            name: p.name,
            vendor: p.vendor,
            priceRUAH: p.price,
            id: p.id,
            categoryId: p.category_id,
            barcode: p.barcode,
            stock: ({
              out_stock: "Нема в наяновсті",
              in_stock: "В наявності",
              on_order: "Під замовлення",
            })[p.stock_status] ?? "В наявності",
          })),
        });
        return res;
      }
      if (input.marketPlace === "prom") {
        const categories = await catalog.categories.listCategories({
          languageId: input.languageId,
        });
        const productVariants = await catalog.productVariants.listAll({
          languageId: input.languageId,
        });
        const file = exports.prom.generate({
          date: new Date(),
          shop: {
            categories: categories.map((c) => ({ id: c.id, name: c.name })),
            offers: {
              offer: productVariants.map((o) => ({
                description: o.description || "",
                description_ua: o.description || "",
                picture: "http://example.com/products/" + (o.images[0] as string),
                id: o.id,
                root: {
                  id: o.id,
                  group_id: o.product_id,
                  available: o.stock_status === "in_stock" ? true : false,
                },
                categoryId: o.category_id,
                name: o.name,
                vendor: o.vendor,
                url: "http://example.com/products/" + o.slug,
                price: o.price,
                image: o.images[0] ?? null,
                name_ua: o.name,
                oldprice: o.old_price,
              })),
            },

          },
        });
        return file;
      }
      // const res = await exports.prom.generate({
      //   date: new Date(),
      //   shop;
      // });
      return null;
    }),
});
