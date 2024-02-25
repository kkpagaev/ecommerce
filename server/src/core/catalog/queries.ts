import { sql } from "@pgtyped/runtime";
import { IOptionCreateQueryQuery, IOptionFindByIdQueryQuery, IOptionDeleteQueryQuery, IAttributeValuesDeleteQueryQuery, IAttributeListCountQueryQuery, IAttributeListQueryQuery, IAttributeDeleteQueryQuery, IAttributeUpdateQueryQuery, IAttributeCreateQueryQuery, IAttributeValuesCreateQueryQuery, IAttributeValuesListQueryQuery, ICategoryCreateQueryQuery, ICategoryFindByIdQueryQuery, ICategoryUpdateQueryQuery, ICategoryListCountQueryQuery, ICategoryListQueryQuery, IAttributeValuesUpdateQueryQuery } from "./queries.types";

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
    ($name!, $description)
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

export const attributeValuesListQuery = sql<IAttributeValuesListQueryQuery>`
  SELECT id, value, attribute_id
  FROM attribute_values
  WHERE attribute_id = $attribute_id
  ORDER BY id;
`;

export const attributeValuesCreateQuery = sql<IAttributeValuesCreateQueryQuery>`
  INSERT INTO attribute_values
    (attribute_id, value)
  VALUES
    $$values(attributeId, value);
`;

export const attributeValuesUpdateQuery = sql<IAttributeValuesUpdateQueryQuery>`
  UPDATE attribute_values
  SET
    value = COALESCE($value, value)
  WHERE
    id = $id!;
`;

export const attributeValuesDeleteQuery = sql<IAttributeValuesDeleteQueryQuery>`
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

export const optionCreateQuery = sql<IOptionCreateQueryQuery>`
  INSERT INTO options
    (name)
  VALUES
    ($name!)
  RETURNING id;
`;

export const optionUpdateQuery = sql`
  UPDATE options
  SET
    name = COALESCE($name, name)
  WHERE
    id = $id!;
`;

export const optionDeleteQuery = sql<IOptionDeleteQueryQuery>`
  DELETE FROM options
  WHERE
    id = $id;
`;

export const optionFindByIdQuery = sql<IOptionFindByIdQueryQuery>`
  SELECT id, name
  FROM options
  WHERE id = $id;
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
    create: attributeValuesCreateQuery,
    update: attributeValuesUpdateQuery,
    delete: attributeValuesDeleteQuery,
    list: attributeValuesListQuery,
  },
  option: {
    create: optionCreateQuery,
    delete: optionDeleteQuery,
    findById: optionFindByIdQuery,
  },
};
