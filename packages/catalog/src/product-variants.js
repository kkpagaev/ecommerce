// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantsListQueryQuery
 * >}
 */
export const productVariantsListQuery = sql`
  SELECT
    pv.id,
    pv.product_id
  FROM
    product_variants pv
  WHERE
    pv.product_id = $product_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantCreateQueryQuery
 * >}
 */
export const productVariantCreateQuery = sql`
  INSERT INTO product_variants
    (product_id)
  VALUES
    ($product_id!)
  RETURNING *
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantsOptionsListOptionsQueryQuery
 * >}
 */
export const productVariantsOptionsListOptionsQuery = sql`
  SELECT
    pvo.*,
    od.name
  FROM
    product_variant_options pvo
  JOIN
    option_descriptions od
      ON pvo.option_id = od.option_id
  WHERE
    pvo.product_variant_id IN $$product_variant_ids!
  AND
    od.language_id = $language_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantDeleteQueryQuery
 * >}
 */
export const productVariantDeleteQuery = sql`
  DELETE FROM product_variants
  WHERE id = $id!
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantsOptionsDeleteQueryQuery
 * >}
 */
export const productVariantsOptionsDeleteQuery = sql`
  DELETE FROM product_variant_options
  WHERE product_variant_id = $product_variant_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantOptionsUpsertQueryQuery
 * >}
 */
export const productVariantOptionsUpsertQuery = sql`
  INSERT INTO product_variant_options
    (product_variant_id, option_id)
  VALUES
    $$values(product_variant_id!, option_id!)
  ON CONFLICT DO NOTHING;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantsFindOneQueryQuery
 * >}
 */
export const productVariantsFindOneQuery = sql`
  SELECT
    pv.id
  FROM
    product_variants pv
  WHERE
    pv.id = $id!
`;

export class ProductVariants {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   productId: number;
   *   options: number[];
   * }} CreateProductVariant
   */
  /** @param {CreateProductVariant} input */
  async createProductVariant(input) {
    return tx(this.pool, async (client) => {
      const productVariant = await productVariantCreateQuery
        .run(
          {
            product_id: input.productId,
          },
          client,
        )
        .then((r) => r[0]);
      if (!productVariant) {
        throw new Error("Failed to create product variant");
      }
      if (input.options) {
        await productVariantOptionsUpsertQuery.run(
          {
            values: input.options.map((o) => ({
              product_variant_id: productVariant.id,
              option_id: o,
            })),
          },
          client,
        );
      }

      return productVariant;
    });
  }

  /** @typedef {Partial<Exclude<CreateProductVariant, "productId">>} UpdateProductVariant */
  /**
   * @param {number} variantId
   * @param {UpdateProductVariant} input
   */
  async updateProductVariant(variantId, input) {
    return tx(this.pool, async (client) => {
      if (input.options) {
        await productVariantsOptionsDeleteQuery
          .run(
            {
              product_variant_id: variantId,
            },
            client,
          )
          .then((r) => r[0]);
        if (input.options) {
          await productVariantOptionsUpsertQuery.run(
            {
              values: input.options.map((o) => ({
                product_variant_id: variantId,
                option_id: o,
              })),
            },
            client,
          );
        }
      }
      return;
    });
  }

  /**
   * @param {{
   *   productVariantIds: number[];
   *   languageId: number;
   * }} input
   */
  async listProductVariantsOptions(input) {
    const options = await productVariantsOptionsListOptionsQuery.run(
      {
        product_variant_ids: input.productVariantIds,
        language_id: input.languageId,
      },
      this.pool,
    );

    return options;
  }

  /**
   * @param {{
   *   productId: number;
   *   languageId: number;
   * }} input
   */
  async listProductVariants(input) {
    const productVariants = await productVariantsListQuery.run(
      {
        product_id: input.productId,
      },
      this.pool,
    );
    if (productVariants.length === 0) {
      return [];
    }
    const options = await productVariantsOptionsListOptionsQuery.run(
      {
        product_variant_ids: productVariants.map((pv) => pv.id),
        language_id: input.languageId,
      },
      this.pool,
    );
    const result = productVariants.map((pv) => ({
      ...pv,
      options: options.filter((o) => o.product_variant_id === pv.id),
    }));

    return result;
  }

  /** @param {number} variantId */
  async deleteProductVariant(variantId) {
    return await productVariantDeleteQuery
      .run(
        {
          id: variantId,
        },
        this.pool,
      )
      .then((r) => r[0]);
  }

  /**
   * @param {{
   *   variantId: number;
   *   languageId: number;
   * }} input
   */
  async findOneProductVariant(input) {
    const productVariant = await productVariantsFindOneQuery
      .run(
        {
          id: input.variantId,
        },
        this.pool,
      )
      .then((r) => r[0]);
    if (!productVariant) {
      return null;
    }
    const options = await productVariantsOptionsListOptionsQuery.run(
      {
        product_variant_ids: [productVariant.id],
        language_id: input.languageId,
      },
      this.pool,
    );
    return {
      ...productVariant,
      options: options,
    };
  }
}
