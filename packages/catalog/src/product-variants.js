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
    pv.id
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
    pvo.*
  FROM
    product_variant_options pvo
  WHERE
    pvo.product_variant_id IN ($$product_variant_ids!)
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

  /** @param {number} productId */
  async listProductVariants(productId) {
    const productVariants = await productVariantsListQuery.run(
      {
        product_id: productId,
      },
      this.pool,
    );
    if (productVariants.length === 0) {
      return [];
    }
    const options = await productVariantsOptionsListOptionsQuery.run(
      {
        product_variant_ids: productVariants.map((pv) => pv.id),
      },
      this.pool,
    );
    const result = productVariants.map((pv) => ({
      ...pv,
      options: options
        ?.filter((o) => o.product_variant_id === pv.id)
        .map((o) => o.option_id),
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
}
