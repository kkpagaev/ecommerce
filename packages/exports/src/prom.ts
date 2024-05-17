import dayjs from "dayjs";
import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

// type Currency = {
//   id: string;
//   rate: string;
// };

type Category = {
  id: number;
  parentId?: number;
  name: string;
};

// product
type Offer = {
  root: {
    id: number;
    group_id: number;
    available: boolean;
  };
  url: string;
  price: number;
  oldprice?: number;
  currencyId?: string;
  categoryId: number;
  picture: string;
  vendorCode?: string;
  vendor: string;
  name: string;
  description: string;
  name_ua: string;
  description_ua: string;
};

type Shop = {
  // <?xml version="1.0" encoding="UTF-8"?>
  // <!DOCTYPE yml_catalog
  // SYSTEM "shops.dtd">
  // <yml_catalog date="2024-05-16 07:29">
  //  <shop>
  //   <currencies>
  //    <currency id="UAH" rate="1"/>
  //   </currencies>
  // currencies: {
  //   currency: Currency;
  // };

  categories: Category[];
  offers: {
    offer: Offer[];
  };
};

type YmlCatalog = {
  date: Date;
  shop: Shop;
};

export class PromGenerator {
  offer(offer: Offer) {
    let item = create().ele("item");
    type ProductCallbacks<
      T extends Omit<Offer, "root"> = Omit<Offer, "root">,
      K extends keyof T = keyof T,
    > = {
      [P in K]: (value: Exclude<T[P], null | undefined>) => XMLBuilder;
    };
    let root = create().ele("offer", {
      id: offer.root.id,
      group_id: offer.root.group_id,
      available: offer.root.available === true ? "true" : "false",
    });
    const p: ProductCallbacks = {
      currencyId: (v) => create().ele("currencyId").txt(v).up(),
      vendorCode: (v) => create().ele("vendorCode").txt(v).up(),
      categoryId: (v) =>
        create()
          .ele("categoryId")
          .txt("" + v)
          .up(),
      picture: (v) => create().ele("picture").txt(v).up(),
      name: (value) => create().ele("name").txt(value).up(),
      description: (value) => create().ele("description").txt(value).up(),
      url: (v) => create().ele("url").txt(v).up(),
      price: (v) => create().ele("price").txt(v.toFixed(2)).up(),
      oldprice: (v) => create().ele("oldprice").txt(v.toFixed(2)).up(),
      name_ua: (v) => create().ele("name_ua").txt(v).up(),
      description_ua: (v) => create().ele("description_ua").txt(v).up(),
      vendor: (v) => create().ele("vendor").txt(v).up(),
    };

    for (const [key, value] of Object.entries(offer)) {
      if (value === null || value === undefined || value === "") continue;
      const callback = p[key as keyof typeof p];
      if (!callback) continue;

      type T = typeof callback extends (value: infer T) => XMLBuilder
        ? T
        : never;

      root = root.import(callback(value as T));
    }

    return root.up();
  }

  offers(offers: Offer[]) {
    let root = create().ele("offers");

    for (const offer of offers) {
      root = root.import(this.offer(offer));
    }

    return root;
  }
  categories(categories: Category[]) {
    let root = create().ele("categories");

    for (const cat of categories) {
      root = root
        .ele("category", {
          id: cat.id,
          parentId: cat.parentId,
        })
        .txt(cat.name)
        .up();
    }

    return root.up();
  }

  generate(catalog: YmlCatalog) {
    let root = create({ version: "1.0" }).ele("yml_catalog", {
      date: dayjs(catalog.date).format("YYYY-MM-DD HH:mm"),
    });

    root = root.ele("shop").import(this.categories(catalog.shop.categories));

    root = root.import(this.offers(catalog.shop.offers.offer));

    return root.up();
  }
}
