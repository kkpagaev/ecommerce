import { sql } from "@pgtyped/runtime";
import { IAttributeValueDeleteManyQueryQuery, IAttributeValueIdListQueryQuery, IProductUpdateQueryQuery, IProductAttributeValueListQueryQuery, IProductAttributeVAlueInsertQueryQuery, IProductAttributeValueDeleteQueryQuery, IProductListCountQueryQuery, IProductListQueryQuery, IProductFindByIdQueryQuery, IAttributeValueDeleteQueryQuery, IAttributeListCountQueryQuery, IAttributeListQueryQuery, IAttributeDeleteQueryQuery, IAttributeValueCreateQueryQuery, IAttributeValueUpdateQueryQuery } from "./queries.types";
import { PoolClient } from "pg";

export const attributeListCountQuery = sql<IAttributeListCountQueryQuery>`
 SELECT COUNT(*) FROM attributes;
`;

export const attributeDeleteQuery = sql<IAttributeDeleteQueryQuery>`
  DELETE FROM attributes
  WHERE id = $id!;
`;

export const attributeValueIdListQuery = sql<IAttributeValueIdListQueryQuery>`
  SELECT id FROM attribute_values
  WHERE attribute_id = $attributeId!;
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

export const attributeValueDeleteManyQuery = sql<IAttributeValueDeleteManyQueryQuery>`
  DELETE FROM attribute_values
  WHERE id IN $$ids;
`;

export interface IAttributeValueUpsertQueryParams {
  values: readonly ({
    id: number | null | void;
    attributeId: number;
    value: Translation;
  })[];
}

// basicaly when inserting null as id, it uses autoincrement
export async function attributeValueUpsertQuery(
  { values }: IAttributeValueUpsertQueryParams,
  client: PoolClient,
): Promise<any> {
  return await client.query(
    `
  INSERT INTO attribute_values
  (id, attribute_id, value)
  VALUES ${
    // ???
    values.map(
      (_, i) => `(
      COALESCE(
        $${i * 3 + 1},
        nextval('attributes_id_seq'::regclass)
      ),
      $${i * 3 + 2}, 
      $${i * 3 + 3})`
    )
  }
  ON CONFLICT (id)
  DO UPDATE SET value = EXCLUDED.value;
    `,
    values.map((i) => [i.id, i.attributeId, i.value]).flat()
  );
}

// export const productAttributeValueListQuery = sql<IProductAttributeValueListQueryQuery>`
//   SELECT v.*,
//      a.NAME AS attribute_name
//   FROM   attribute_values v
//      JOIN product_attributes pa
//        ON pa.attribute_value_id = v.id
//      JOIN attributes a
//        ON a.id = v.attribute_id
//   WHERE  pa.product_id = $productId
// `;

// export const productAttributeValueDeleteQuery = sql<IProductAttributeValueDeleteQueryQuery>`
//   DELETE FROM product_attributes WHERE product_id = $product_id;
// `;

// export const productAttributeVAlueInsertQuery = sql<IProductAttributeVAlueInsertQueryQuery>`
//   INSERT INTO product_attributes(product_id, attribute_value_id)
//   VALUES
//   $$values(productId!, attributeValueId!);
// `;

export const catalogQueries = {
  attribute: {
    list: attributeListQuery,
    listCount: attributeListCountQuery,
    delete: attributeDeleteQuery,
  },
  attributeValue: {
    upsert: { run: attributeValueUpsertQuery },
    deleteMany: attributeValueDeleteManyQuery,
    idList: attributeValueIdListQuery,
    update: attributeValueUpdateQuery,
    delete: attributeValueDeleteQuery,
  },
};
