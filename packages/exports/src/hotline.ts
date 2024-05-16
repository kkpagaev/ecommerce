import { create } from "xmlbuilder2";
import dayjs from "dayjs";

type Product = {
  id: number;
  categoryId: number;
  code?: string;
  barcode?: string;
  vendor: string;
  name: string;
  description?: string;
  url: string;
  image?: string;
  priceRUAH: number;
  priceRUSD?: number;
  stock: "В наявності" | "Під замовлення" | "Немає";
  region?: string;
  params?: {
    name: string;
    value: string;
  }[];
  condition?: 0 | 1 | 2 | 3;
  // shipping: number;
  // custom: number;
};

export type Category = {
  id: number;
  name: string;
  parentId?: number;
};

export class HotlineGenerator {
  dateFormat(date: Date) {
    return create()
      .ele("date")
      .txt(dayjs(date, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm"))
      .up();
  }

  firmName(str: string) {
    return create().ele("firmName").txt(str).up();
  }

  rate(rate: number) {
    return create().ele("rate").txt(rate.toString()).up();
  }

  categories(cats: Category[]) {
    let root = create().ele("categories");
    root = cats
      .map((c) => {
        let catRoot = create().ele("category");
        catRoot = catRoot.ele("id").txt(c.id.toString()).up();
        if (c.parentId) {
          catRoot = catRoot.ele("parentId").txt(c.parentId.toString()).up();
        }

        catRoot = catRoot.ele("name").txt(c.name.toString()).up();
        return catRoot.up();
      })
      .reduce((acc, n) => acc.import(n), root);

    return root.up();
  }

  products(products: Product[]) {
    let items = create().ele("items");

    for (const product of products) {
      items = items.import(this.product(product));
    }

    return items.up();
  }

  product(product: Product) {
    let item = create().ele("item");

    item = item.ele("id").txt(product.id.toString()).up();
    item = item.ele("categoryId").txt(product.categoryId.toString()).up();

    if (product.code) item = item.ele("code").txt(product.code).up();
    if (product.barcode && product.barcode !== "")
      create().ele("barcode").txt(product.barcode).up();
    if (product.vendor && product.vendor !== "")
      item = item.ele("vendor").txt(product.vendor).up();
    if (product.name && product.name !== "")
      item = item.ele("name").txt(product.name).up();
    if (product.description && product.description !== "")
      item = item.ele("description").txt(product.description).up();
    if (product.url && product.url !== "")
      item = item.ele("url").txt(product.url).up();
    if (product.image && product.image !== "")
      item = item.ele("image").txt(product.image).up();
    if (product.priceRUAH)
      item = item.ele("priceRUAH").txt(product.priceRUAH.toFixed(2)).up();
    if (product.priceRUSD)
      item = item.ele("priceRUSD").txt(product.priceRUSD.toFixed(2)).up();
    if (
      product.stock &&
      ["В наявності", "Під замовлення", "Немає"].includes(product.stock)
    )
      item = item.ele("stock").txt(product.stock).up();
    if (product.region && product.region !== "")
      item = item.ele("region").txt(product.region).up();
    if (
      product.condition !== undefined &&
      ([0, 1, 2, 3] as const).includes(product.condition)
    )
      item = item.ele("condition").txt(product.condition.toString()).up();

    return item.up();
  }

  generate(params: {
    rate: number;
    firmName: string;
    date: Date;
    categories: Category[];
    products: Product[];
  }) {
    // root
    let price = create({ version: "1.0" }).ele("price");
    price = price.import(this.firmName(params.firmName));
    price = price.import(this.dateFormat(params.date));
    price = price.import(this.categories(params.categories));
    price = price.import(this.products(params.products));

    return price.up();
  }
}
// function buildHotline() {
//   const gen = new HotlineGenerator();
//   const res = gen.generate({
//     rate: 40.2,
//     firmName: "test",
//     date: new Date(),
//     categories: [
//       {
//         id: 1,
//         name: "foo",
//       },
//       {
//         id: 2,
//         parentId: 1,
//         name: "foo",
//       },
//     ],
//     products: [
//       {
//         id: 1,
//         categoryId: 1,
//         name: "foo",
//         description: "foo",
//         barcode: "foo",
//         vendor: "foo",
//         url: "foo",
//         priceRUAH: 100,
//         stock: "В наявності",
//         code: "foo",
//         image: "foo",
//       },
//     ],
//   });
//
//   return res;
// }
