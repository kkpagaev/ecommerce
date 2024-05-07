// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";
// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute-group.types").IAttributeGroupFindOneQueryQuery
 * >}
 */
export const attributeGroupFindOneQuery = sql`
 SELECT id, sort_order
 FROM attribute_groups
 WHERE id = COALESCE($id, id)
 LIMIT 1;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute-group.types").IAttributeGroupDescriptionListQueryQuery
 * >}
 */
export const attributeGroupDescriptionListQuery = sql`
  SELECT *
  FROM attribute_group_descriptions
  WHERE attribute_group_id = $attribute_group_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute-group.types").IAttributeGroupCreateQueryQuery
 * >}
 */
export const attributeGroupCreateQuery = sql`
  INSERT INTO attribute_groups
    (sort_order)
  VALUES
    ($sort_order!)
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute-group.types").IAttributeGroupUpdateQueryQuery
 * >}
 */
export const attributeGroupUpdateQuery = sql`
  UPDATE attribute_groups
  SET
    sort_order = COALESCE($sort_order, sort_order)
  WHERE
    id = $id!
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute-group.types").IAttributeGroupDescriptionUpsertQueryQuery
 * >}
 */
export const attributeGroupDescriptionUpsertQuery = sql`
  INSERT INTO attribute_group_descriptions
     (attribute_group_id, language_id, name, description)
  VALUES
     $$values(attribute_group_id!, language_id!, name!, description)
  ON CONFLICT
    (attribute_group_id, language_id)
  DO
    UPDATE
      SET
        name = EXCLUDED.name,
        description = EXCLUDED.description
  RETURNING *;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute-group.types").IAttributeGroupListQueryQuery
 * >}
 */
export const attributeGroupListQuery = sql`
  SELECT g.id, d.name
  FROM attribute_groups g
  JOIN attribute_group_descriptions d
    ON g.id = d.attribute_group_id
  WHERE d.language_id = $language_id!
  AND d.name LIKE COALESCE(CONCAT('%', $name::text, '%'), d.name)
`;

export class AttributeGroups {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   id?: number;
   * }} FindOneAttributeGroupProps
   */

  /** @param {FindOneAttributeGroupProps} props */
  async findOneAttributeGroup(props) {
    const group = await attributeGroupFindOneQuery
      .run(
        {
          id: props.id,
        },
        this.pool,
      )
      .then((res) => res[0]);
    if (!group) return null;

    const descriptions = await attributeGroupDescriptionListQuery.run(
      {
        attribute_group_id: group.id,
      },
      this.pool,
    );

    // const attributes = await attributeListQuery.run(
    //   {
    //     attribute_group_id: group.id,
    //     language_id: props.languageId,
    //   },
    //   this.pool,
    // );

    return {
      ...group,
      descriptions,
      // attributes,
    };
  }

  /**
   * @typedef {{
   *   sortOrder?: number;
   *   descriptions?: {
   *     languageId: number;
   *     name: string;
   *     description: string | null;
   *   }[];
   * }} UpdateAttributeGroupProps
   */
  /**
   * @param {number} id
   * @param {UpdateAttributeGroupProps} input
   */
  async updateAttributeGroup(id, input) {
    return tx(this.pool, async (client) => {
      const group = await attributeGroupUpdateQuery
        .run(
          {
            sort_order: input.sortOrder,
            id,
          },
          client,
        )
        .then((res) => res[0]);
      if (input.descriptions) {
        await attributeGroupDescriptionUpsertQuery.run(
          {
            values: input.descriptions.map((d) => ({
              name: d.name,
              description: d.description,
              language_id: d.languageId,
              attribute_group_id: id,
            })),
          },
          client,
        );
      }
      return group;
    });
  }

  /**
   * @param {{
   *   languageId: number;
   *   name?: string;
   * }} input
   */
  async listAttributeGroups(input) {
    const res = await attributeGroupListQuery.run(
      {
        language_id: input.languageId,
        name: input.name,
      },
      this.pool,
    );

    return res;
  }

  /**
   * @typedef {{
   *   sortOrder: number;
   *   descriptions: {
   *     languageId: number;
   *     name: string;
   *     description: string | null;
   *   }[];
   * }} CreateAttributeProps
   */
  /** @param {CreateAttributeProps} input */
  async createAttributeGroup(input) {
    return tx(this.pool, async (client) => {
      const group = await attributeGroupCreateQuery
        .run(
          {
            sort_order: input.sortOrder,
          },
          client,
        )
        .then((res) => res[0]);
      if (!group) {
        throw new Error("Failed to create attribute group");
      }
      await attributeGroupDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            name: d.name,
            description: d.description,
            language_id: d.languageId,
            attribute_group_id: group.id,
          })),
        },
        client,
      );
      return group;
    });
  }
}
