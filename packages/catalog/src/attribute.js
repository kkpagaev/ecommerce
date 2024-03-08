import { tx } from "@repo/pool";
/** @typedef {import("pg").Pool} Pool * */
// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute.types").IAttributeDeletQueryQuery
 * >}
 */
export const attributeDeletQuery = sql`
  DELETE FROM attributes
  WHERE id = $id!;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute.types").IAttributeDescriptionDeleteQueryQuery
 * >}
 */
export const attributeDescriptionDeleteQuery = sql`
  DELETE FROM attribute_descriptions
  WHERE language_id = $languageId!
  AND attribute_id = $attributeId!;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute.types").IAttributeCreateQueryQuery
 * >}
 */
export const attributeCreateQuery = sql`
  INSERT INTO attributes
    (attribute_group_id)
  VALUES
    ($attributeGroupId!)
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute.types").IAttributeDescriptionUpsertQueryQuery
 * >}
 */
export const attributeDescriptionUpsertQuery = sql`
  INSERT INTO attribute_descriptions
    (attribute_id, language_id, name)
  VALUES
    $$values(attributeId!, languageId!, name!)
  ON CONFLICT
    (attribute_id, language_id)
  DO UPDATE
    SET
      name = EXCLUDED.name
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute.types").IAttributeFindOneQueryQuery
 * >}
 */
export const attributeFindOneQuery = sql`
  SELECT *
  FROM attributes
  WHERE id = $id!;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/attribute.types").IAttributeDescriptionListQueryQuery
 * >}
 */
export const attributeDescriptionListQuery = sql`
  SELECT *
    FROM attribute_descriptions
    WHERE attribute_id = $attribute_id!
`;

export class Attributes {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /** @param {{ attributeId: number; languageId: number }} input */
  async deleteAttributeDescription(input) {
    return await attributeDescriptionDeleteQuery.run(input, this.pool);
  }

  /**
   * @typedef {{
   *   id: number;
   * }} FindOneAttributeProps
   */
  /** @param {FindOneAttributeProps} props */
  async findOneAttribute(props) {
    const attribute = await attributeFindOneQuery
      .run(props, this.pool)
      .then((res) => res[0]);
    if (!attribute) return null;
    const descriptions = await attributeDescriptionListQuery.run(
      {
        attribute_id: attribute.id,
      },
      this.pool,
    );
    return {
      ...attribute,
      descriptions,
    };
  }

  /**
   * @typedef {{
   *   descriptions: {
   *     languageId: number;
   *     name: string;
   *   }[];
   * }} UpdateAttributeProps
   */
  /**
   * @param {number} id
   * @param {UpdateAttributeProps} input
   */
  async updateAttribute(id, input) {
    return await tx(this.pool, async (client) => {
      const descriptions = await attributeDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            name: d.name,
            languageId: d.languageId,
            attributeId: id,
          })),
        },
        client,
      );

      return {
        descriptions,
      };
    });
  }

  /** @param {number} id */
  async deleteAttribute(id) {
    return await attributeDeletQuery.run(
      {
        id: id,
      },
      this.pool,
    );
  }

  /**
   * @typedef {{
   *   groupId: number;
   *   descriptions: {
   *     languageId: number;
   *     name: string;
   *   }[];
   * }} CreateAttribute
   */
  /** @param {CreateAttribute} input */
  async createAttribute(input) {
    return tx(this.pool, async (client) => {
      const attribute = await attributeCreateQuery
        .run(
          {
            attributeGroupId: input.groupId,
          },
          client,
        )
        .then((r) => r[0]);
      if (!attribute) throw new Error("Failed to create attribute");
      const descriptions = await attributeDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            name: d.name,
            languageId: d.languageId,
            attributeId: attribute.id,
          })),
        },
        client,
      );

      return {
        ...attribute,
        descriptions,
      };
    });
  }
}
