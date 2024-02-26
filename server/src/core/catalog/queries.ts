import { sql } from "@pgtyped/runtime";
import { IProductFindOneQueryQuery, IProductAttributeVAlueInsertQueryQuery, IProductAttributeValueDeleteQueryQuery, IProductCreateQueryQuery, IPriceUpsertQueryQuery, IProductListCountQueryQuery, IProductListQueryQuery, IProductFindByIdQueryQuery, IAttributeValueDeleteQueryQuery, IAttributeListCountQueryQuery, IAttributeListQueryQuery, IAttributeDeleteQueryQuery, IAttributeUpdateQueryQuery, IAttributeCreateQueryQuery, IAttributeValueCreateQueryQuery, IAttributeValueListQueryQuery, ICategoryCreateQueryQuery, ICategoryFindByIdQueryQuery, ICategoryUpdateQueryQuery, ICategoryListCountQueryQuery, ICategoryListQueryQuery, IAttributeValueUpdateQueryQuery } from "./queries.types";

export const attributeFindByIdQuery = sql`
 SELECT id, name, description 
 FROM attributes
 WHERE id = $id!
`;

export const attributeListCountQuery = sql<IAttributeListCountQueryQuery>`
 SELECT COUNT(*) FROM attributes;
`;

export const attributeListQuery = sql<IAttributeListQueryQuery>`
 SELECT id, name, description
 FROM attributes
 ORDER BY id
 LIMIT COALESCE($limit, 10)
 OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

export const attributeCreateQuery = sql<IAttributeCreateQueryQuery>`
  INSERT INTO attributes
    (name, description)
  VALUES
    $$values(name!, description)
  RETURNING id;
`;

export const attributeUpdateQuery = sql<IAttributeUpdateQueryQuery>`
  UPDATE attributes
  SET
    name = COALESCE($name, name),
    description = COALESCE($description, description)
  WHERE
    id = $id!;
`;

export const attributeDeleteQuery = sql<IAttributeDeleteQueryQuery>`
  DELETE FROM attributes
  WHERE id = $id!;
`;

export const attributeValueListQuery = sql<IAttributeValueListQueryQuery>`
  SELECT id, value, attribute_id
  FROM attribute_values
  WHERE attribute_id = $attribute_id
  ORDER BY id;
`;

export const attributeValueCreateQuery = sql<IAttributeValueCreateQueryQuery>`
  INSERT INTO attribute_values
    (attribute_id, value)
  VALUES
    $$values(attributeId, value)
  RETURNING id;
`;

export const attributeValueUpdateQuery = sql<IAttributeValueUpdateQueryQuery>`
  UPDATE attribute_values
  SET
    value = COALESCE($value, value)
  WHERE
    id = $id!;
`;

export const attributeValueDeleteQuery = sql<IAttributeValueDeleteQueryQuery>`
  DELETE FROM attribute_values
  WHERE id = $id!;
`;

export const categoryListCountQuery = sql<ICategoryListCountQueryQuery>`
  SELECT COUNT(*) FROM categories;
`;

export const categoryListQuery = sql<ICategoryListQueryQuery>`
  SELECT id, name, slug, description
  FROM categories
  ORDER BY id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

export const categoryFindByIdQuery = sql<ICategoryFindByIdQueryQuery>`
  SELECT id, name, slug, description FROM categories
  WHERE id = $id;
`;

// export const categoryFindQuery = sql<ICategoryFindQueryQuery>`
//   SELECT id, name, slug, description FROM categories
//   WHERE id = COALESCE($id, id)
//   AND name->>$locale! = COALESCE($name, name->>$locale!)
//   AND slug = COALESCE($slug, slug)
// `;

export const categoryCreateQuery = sql<ICategoryCreateQueryQuery>`
  INSERT INTO categories
    (name, slug, description)
  VALUES
    ($name!, $slug!, $description)
  RETURNING id;
`;

export const categoryUpdateQuery = sql<ICategoryUpdateQueryQuery>`
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

export const productListQuery = sql<IProductListQueryQuery>`
  SELECT * FROM products
  ORDER BY id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

export const productFindOneQuery = sql<IProductFindOneQueryQuery>`
  SELECT * FROM products
  WHERE id = COALESCE($id, id)
  LIMIT 1;
`;

export const productCreateQuery = sql<IProductCreateQueryQuery>`
  INSERT INTO products
  (name, description, slug, category_id)
  VALUES
  ($name!, $description, $slug!, $categoryId!)
  RETURNING id;
`;

export const productAttributeValueDeleteQuery = sql<IProductAttributeValueDeleteQueryQuery>`
  DELETE FROM product_attributes WHERE product_id = $product_id;
`;

export const productAttributeVAlueInsertQuery = sql<IProductAttributeVAlueInsertQueryQuery>`
  INSERT INTO product_attributes(product_id, attribute_value_id) 
  VALUES
  $$values(product_id!, attribute_value_id!);
`;

export const productListCountQuery = sql<IProductListCountQueryQuery>`
  SELECT COUNT(*) FROM products
`;

export const productFindByIdQuery = sql<IProductFindByIdQueryQuery>`
  SELECT * FROM products
  WHERE id = $id;
`;

export const priceUpsertQuery = sql<IPriceUpsertQueryQuery>`
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
    list: attributeListQuery,
    listCount: attributeListCountQuery,
    findById: attributeFindByIdQuery,
    create: attributeCreateQuery,
    update: attributeUpdateQuery,
    delete: attributeDeleteQuery,
  },
  attributeValue: {
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
    create: productAttributeVAlueInsertQuery,
    delete: productAttributeValueDeleteQuery,
  },
  product: {
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
