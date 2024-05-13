import { Pool } from "pg";
import { ProductFiltering, getOptionsQuery } from "./product-filtering";

export { Products } from "./product";
export { Attributes } from "./attribute";
export { Categories } from "./category";
export { AttributeGroups } from "./attribute-group";
export { Options } from "./option";
export { OptionGroups } from "./option-group";
export { ProductVariants } from "./product-variants";
export { ProductFiltering } from "./product-filtering";

async function main() {
  const p = new Pool({
    connectionString: "postgres://user:user@localhost:1252/user",
  });
  const c = new ProductFiltering({ pool: p });
  console.log(
    await c.getFilters({
      attributes: [],
      options: [],
    }),
  );

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
