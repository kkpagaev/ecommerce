import { Pool } from "pg";
import { ProductFiltering } from "./product-filtering";

export { Products } from "./product";
export { Attributes } from "./attribute";
export { Categories } from "./category";
export { AttributeGroups } from "./attribute-group";
export { Options } from "./option";
export { OptionGroups } from "./option-group";
export { ProductVariants } from "./product-variants";
export { ProductFiltering } from "./product-filtering";
export { Vendors } from "./vendor";

async function main() {
  const p = new Pool({
    connectionString: "postgres://user:user@localhost:1252/user",
  });
  const c = new ProductFiltering({ pool: p });
  // console.debug((await c.getFilters({ category: 1 })).options);

  // const result = await db.query(sql, params);
  //   console.log(
  //     await getOptionsQuery.run(
  //       {
  //         attributeIds: [1],
  //       },
  //       p,
  //     ),
  //   );
}

// main();
