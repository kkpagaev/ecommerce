import { sql } from "@pgtyped/runtime";
import { IAttributeListCountQueryQuery, IAttributeListQueryQuery, IAttributeFindByIdQueryQuery, IAttributeDeleteQueryQuery, IAttributeUpdateQueryQuery, IAttributeCreateQueryQuery, IAttributeValuesCreateQueryQuery, IAttributeValuesListQueryQuery, ICategoryCreateQueryQuery, ICategoryFindByIdQueryQuery, ICategoryUpdateQueryQuery, ICategoryListCountQueryQuery, ICategoryListQueryQuery } from "./queries.types";

export const attributeFindByIdQuery = sql<IAttributeFindByIdQueryQuery>`
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
