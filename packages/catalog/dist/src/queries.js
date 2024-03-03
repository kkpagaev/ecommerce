import { sql } from "@pgtyped/runtime";
export const attributeFindByIdQuery = sql `
 SELECT id, name, description 
 FROM attributes
 WHERE id = $id!
`;
export const attributeFindOneQuery = sql `
 SELECT id, name, description
 FROM attributes
 WHERE id = COALESCE($id, id)
 LIMIT 1;
`;
export const attributeListCountQuery = sql `
 SELECT COUNT(*) FROM attributes;
`;
export const attributeListQuery = sql `
 SELECT id, name, description
 FROM attributes
 ORDER BY id
 LIMIT COALESCE($limit, 10)
 OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;
export const attributeCreateQuery = sql `
  INSERT INTO attributes
    (name, description)
  VALUES
    $$values(name!, description)
  RETURNING id;
`;
export const attributeUpdateQuery = sql `
  UPDATE attributes
  SET
    name = COALESCE($name, name),
    description = COALESCE($description, description)
  WHERE
    id = $id!;
`;
export const attributeDeleteQuery = sql `
  DELETE FROM attributes
  WHERE id = $id!;
`;
export const attributeValueListQuery = sql `
  SELECT id, value, attribute_id
  FROM attribute_values
  WHERE attribute_id = $attribute_id
  ORDER BY id;
`;
export const attributeValueIdListQuery = sql `
  SELECT id FROM attribute_values
  WHERE attribute_id = $attributeId!;
`;
export const attributeValueCreateQuery = sql `
  INSERT INTO attribute_values
    (attribute_id, value)
  VALUES
    $$values(attributeId, value)
  RETURNING id;
`;
export const attributeValueUpdateQuery = sql `
  UPDATE attribute_values
  SET
    value = COALESCE($value, value)
  WHERE
    id = $id!;
`;
export const attributeValueDeleteQuery = sql `
  DELETE FROM attribute_values
  WHERE id = $id!;
`;
export const attributeValueDeleteManyQuery = sql `
  DELETE FROM attribute_values
  WHERE id IN $$ids;
`;
// basicaly when inserting null as id, it uses autoincrement
export async function attributeValueUpsertQuery({ values }, client) {
    return await client.query(`
  INSERT INTO attribute_values
  (id, attribute_id, value)
  VALUES ${
    // ???
    values.map((_, i) => `(
      COALESCE(
        $${i * 3 + 1},
        nextval('attributes_id_seq'::regclass)
      ),
      $${i * 3 + 2}, 
      $${i * 3 + 3})`)}
  ON CONFLICT (id)
  DO UPDATE SET value = EXCLUDED.value;
    `, values.map((i) => [i.id, i.attributeId, i.value]).flat());
}
export const categoryListCountQuery = sql `
  SELECT COUNT(*) FROM categories;
`;
export const categoryListQuery = sql `
  SELECT id, name, slug, description
  FROM categories
  ORDER BY id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;
export const categoryFindByIdQuery = sql `
  SELECT id, name, slug, description FROM categories
  WHERE id = $id;
`;
// export const categoryFindQuery = sql<ICategoryFindQueryQuery>`
//   SELECT id, name, slug, description FROM categories
//   WHERE id = COALESCE($id, id)
//   AND name->>$locale! = COALESCE($name, name->>$locale!)
//   AND slug = COALESCE($slug, slug)
// `;
export const categoryCreateQuery = sql `
  INSERT INTO categories
    (name, slug, description)
  VALUES
    ($name!, $slug!, $description)
  RETURNING id;
`;
export const categoryUpdateQuery = sql `
  UPDATE categories
  SET
    name = COALESCE($name, name),
    slug = COALESCE($slug, slug),
    description = COALESCE($description, description)
  WHERE
    id = $id!;
`;
// export const optionCreateQuery = sql<IOptionCreateQueryQuery>`
//   INSERT INTO options
//     (name)
//   VALUES
//     ($name!)
//   RETURNING id;
// `;
// export const optionUpdateQuery = sql<IOptionUpdateQueryQuery>`
//   UPDATE options
//   SET
//     name = COALESCE($name, name)
//   WHERE
//     id = $id!;
// `;
// export const optionDeleteQuery = sql<IOptionDeleteQueryQuery>`
//   DELETE FROM options
//   WHERE
//     id = $id;
// `;
// export const optionFindByIdQuery = sql<IOptionFindByIdQueryQuery>`
//   SELECT id, name
//   FROM options
//   WHERE id = $id;
// `;
export const productListQuery = sql `
  SELECT * FROM products
  ORDER BY id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;
export const productFindOneQuery = sql `
  SELECT * FROM products
  WHERE id = COALESCE($id, id)
  LIMIT 1;
`;
export const productDeleteQuery = sql `
  DELETE FROM products
  WHERE id = $id!
  RETURNING id;
`;
export const productCreateQuery = sql `
  INSERT INTO products
  (name, description, slug, category_id)
  VALUES
  ($name!, $description, $slug!, $categoryId!)
  RETURNING id;
`;
export const productUpdateQuery = sql `
  UPDATE products
  SET
    name = COALESCE($name, name),
    description = COALESCE($description, description),
    slug = COALESCE($slug, slug),
    category_id = COALESCE($categoryId, category_id)
  WHERE
    id = $id!;
`;
export const productAttributeValueListQuery = sql `
  SELECT v.*,
     a.NAME AS attribute_name
  FROM   attribute_values v
     JOIN product_attributes pa
       ON pa.attribute_value_id = v.id
     JOIN attributes a
       ON a.id = v.attribute_id
  WHERE  pa.product_id = $productId
`;
export const productAttributeValueDeleteQuery = sql `
  DELETE FROM product_attributes WHERE product_id = $product_id;
`;
export const productAttributeVAlueInsertQuery = sql `
  INSERT INTO product_attributes(product_id, attribute_value_id) 
  VALUES
  $$values(productId!, attributeValueId!);
`;
export const productListCountQuery = sql `
  SELECT COUNT(*) FROM products
`;
export const productFindByIdQuery = sql `
  SELECT * FROM products
  WHERE id = $id;
`;
export const priceUpsertQuery = sql `
  INSERT INTO prices (product_id, price, type)
  VALUES $$values(product_id!, price!, type)
  ON CONFLICT (product_id, type)
  DO UPDATE SET price = EXCLUDED.price;
`;
export const catalogQueries = {
    category: {
        create: categoryCreateQuery,
        update: categoryUpdateQuery,
        list: categoryListQuery,
        listCount: categoryListCountQuery,
        findById: categoryFindByIdQuery,
    },
    attribute: {
        findOne: attributeFindOneQuery,
        list: attributeListQuery,
        listCount: attributeListCountQuery,
        findById: attributeFindByIdQuery,
        create: attributeCreateQuery,
        update: attributeUpdateQuery,
        delete: attributeDeleteQuery,
    },
    attributeValue: {
        upsert: { run: attributeValueUpsertQuery },
        deleteMany: attributeValueDeleteManyQuery,
        idList: attributeValueIdListQuery,
        create: attributeValueCreateQuery,
        update: attributeValueUpdateQuery,
        delete: attributeValueDeleteQuery,
        list: attributeValueListQuery,
    },
    // option: {
    //   update: optionUpdateQuery,
    //   create: optionCreateQuery,
    //   delete: optionDeleteQuery,
    //   findById: optionFindByIdQuery,
    // },
    productAttributeValue: {
        list: productAttributeValueListQuery,
        create: productAttributeVAlueInsertQuery,
        delete: productAttributeValueDeleteQuery,
    },
    product: {
        update: productUpdateQuery,
        delete: productDeleteQuery,
        findOne: productFindOneQuery,
        create: productCreateQuery,
        listCount: productListCountQuery,
        list: productListQuery,
        findById: productFindByIdQuery,
    },
    price: {
        upsert: priceUpsertQuery,
    },
};
//# sourceMappingURL=queries.js.map