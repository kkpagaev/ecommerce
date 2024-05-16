// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";
import { tx } from "@repo/pool";
import { groupBy } from "lodash";
// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";
import {
  productAttributeListQuery,
  productAttributeViewQuery,
} from "./product";

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
    (product_id, slug, stock_status, price, old_price, article, discount, popularity, images, barcode, is_active)
  VALUES
    (
      $product_id!, 
      $slug!,
      $stock_status!,
      $price!,
      $old_price!,
      $article!,
      $discount!,
      $popularity!,
      $images!,
      $barcode!,
      $is_active!
    )
  RETURNING *
`;

// | Column             | Type                   | Modifiers |
// |--------------------|------------------------|-----------|
// | product_variant_id | integer                |  not null |
// | language_id        | integer                |  not null |
// | name               | character varying(255) |  not null |
// | short_description  | text                   |           |
// Indexes:

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantDescriptionsUpsertQueryQuery
 * >}
 */
export const productVariantDescriptionsUpsertQuery = sql`
  INSERT INTO product_variant_descriptions
    (product_variant_id, language_id, name, short_description)
  VALUES
    $$values(product_variant_id!, language_id!, name!, short_description)
  ON CONFLICT
    (product_variant_id, language_id)
  DO UPDATE
    SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantUpdateQueryQuery
 * >}
 */
export const productVariantUpdateQuery = sql`
  UPDATE product_variants
  SET
    slug = COALESCE($slug, slug),
    stock_status = COALESCE($stock_status, stock_status),
    price = COALESCE($price, price),
    old_price = COALESCE($old_price, old_price),
    article = COALESCE($article, article),
    discount = COALESCE($discount, discount),
    popularity = COALESCE($popularity, popularity),
    images = COALESCE($images, images),
    barcode = COALESCE($barcode, barcode),
    is_active = COALESCE($is_active, is_active)
  WHERE
    id = $id!
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
    od.name,
    o.option_group_id,
    ogd.name as option_group_name
  FROM
    product_variant_options pvo
  JOIN
    option_descriptions od
      ON pvo.option_id = od.option_id
  JOIN options o
    ON o.id = pvo.option_id
  JOIN option_group_descriptions ogd
    ON o.option_group_id = ogd.option_group_id
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
 *   import("./queries/product-variants.types").IProductVariantsDescriptionsDeleteQueryQuery
 * >}
 */
export const productVariantsDescriptionsDeleteQuery = sql`
  DELETE FROM product_variant_descriptions
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
    pv.*
  FROM
    product_variants pv
  WHERE
    pv.id = COALESCE($id, pv.id)
  AND
    pv.slug = COALESCE($slug, pv.slug)
  LIMIT 1
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantViewQueryQuery
 * >}
 */
export const productVariantViewQuery = sql`
  SELECT
    pv.id,
    pv.slug,
    pv.product_id,
    pv.stock_status,
    pv.price,
    pv.old_price,
    pv.article,
    pv.discount,
    pv.images,
    pvd.name,
    pvd.short_description,
    pd.description,
    v.name as vendor
  FROM
    product_variants pv
  JOIN product_variant_descriptions pvd ON pvd.product_variant_id = pv.id
  JOIN product_descriptions pd ON pd.product_id = pv.product_id
  JOIN products p ON p.id = pv.product_id
  JOIN vendors v ON v.id = p.vendor_id
  WHERE
    pv.id = COALESCE($id, pv.id)
  AND
    pv.slug = COALESCE($slug, pv.slug)
  AND
    pvd.language_id = $language_id!
  AND
    pd.language_id = $language_id!
  LIMIT 1
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantRelatedVariantsQueryQuery
 * >}
 */
export const productVariantRelatedVariantsQuery = sql`
  SELECT 
    pv.id as product_variant_id,
    pv.slug,
    pv.product_id,
    pvo.option_id,
    pv.stock_status,
    od.name as option_name, 
    og.id as option_group_id,
    ogd.name as option_group_name
  FROM product_variants pv 
  JOIN product_variant_options pvo
    ON pvo.product_variant_id = pv.id 
  JOIN option_descriptions od
    ON od.option_id = pvo.option_id
  JOIN options o
    ON o.id = pvo.option_id
  JOIN option_groups og
    ON og.id = o.option_group_id
  JOIN option_group_descriptions ogd
    ON ogd.option_group_id = og.id
  WHERE 
    ogd.language_id = $language_id!
  AND pv.product_id = $product_id!
`;

export class ProductVariants {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   productId: number;
   *   price: number;
   *   oldPrice: number;
   *   article: string;
   *   discount: number;
   *   popularity: number;
   *   images: string[];
   *   barcode: string;
   *   isActive: boolean;
   *   slug: string;
   *   options: number[];
   *   stockStatus: import("./queries/product-variants.types").product_variant_stock_status;
   *   descriptions: {
   *     languageId: number;
   *     name: string;
   *     shortDescription?: string;
   *   }[];
   * }} CreateProductVariant
   */
  /** @param {CreateProductVariant} input */
  async createProductVariant(input) {
    return tx(this.pool, async (client) => {
      console.log(input);
      const productVariant = await productVariantCreateQuery
        .run(
          {
            slug: input.slug,
            stock_status: input.stockStatus,
            price: input.price,
            old_price: input.oldPrice,
            article: input.article,
            discount: input.discount,
            popularity: input.popularity,
            images: JSON.stringify(input.images),
            barcode: input.barcode,
            is_active: input.isActive,
            product_id: input.productId,
          },
          client,
        )
        .then((r) => r[0]);
      if (!productVariant) {
        throw new Error("Failed to create product variant");
      }

      if (input.descriptions) {
        await productVariantDescriptionsUpsertQuery.run(
          {
            values: input.descriptions.map((d) => ({
              product_variant_id: productVariant.id,

              name: d.name,
              short_description: d.shortDescription,
              language_id: d.languageId,
            })),
          },
          client,
        );
      }

      if (input.options.length > 0) {
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
      await productVariantUpdateQuery.run(
        {
          id: variantId,
          slug: input.slug,
          stock_status: input.stockStatus,
          price: input.price,
          old_price: input.oldPrice,
          article: input.article,
          discount: input.discount,
          popularity: input.popularity,
          images: JSON.stringify(input.images),
          barcode: input.barcode,
          is_active: input.isActive,
        },
        client,
      );

      if (input.descriptions) {
        await productVariantsDescriptionsDeleteQuery
          .run(
            {
              product_variant_id: variantId,
            },
            client,
          )
          .then((r) => r[0]);
        if (input.descriptions.length > 0) {
          await productVariantDescriptionsUpsertQuery.run(
            {
              values: input.descriptions.map((d) => ({
                product_variant_id: variantId,

                name: d.name,
                short_description: d.shortDescription,
                language_id: d.languageId,
              })),
            },
            client,
          );
        }
      }
      if (input.options) {
        await productVariantsOptionsDeleteQuery
          .run(
            {
              product_variant_id: variantId,
            },
            client,
          )
          .then((r) => r[0]);
        if (input.options.length > 0) {
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
   *   slug?: string;
   *   variantId?: number;
   *   languageId: number;
   * }} input
   */
  async productVariantView(input) {
    const productVariant = await productVariantViewQuery
      .run(
        {
          language_id: input.languageId,
          slug: input.slug,
          id: input.variantId,
        },
        this.pool,
      )
      .then((r) => r[0]);

    if (!productVariant) {
      return null;
    }
    const related = await productVariantRelatedVariantsQuery.run(
      {
        product_id: productVariant.product_id,
        language_id: input.languageId,
      },
      this.pool,
    );
    const options = await productVariantsOptionsListOptionsQuery.run(
      {
        language_id: input.languageId,
        product_variant_ids: [productVariant.id],
      },
      this.pool,
    );
    const attributes = await productAttributeViewQuery.run(
      {
        product_id: productVariant.product_id,
        language_id: input.languageId,
      },
      this.pool,
    );

    /** @type {string[]} */
    const images = /** @type {any} */ (productVariant.images);
    return {
      ...productVariant,
      images: images,
      attributes: attributes,
      related: related,
      options,
    };
  }

  /**
   * @param {{
   *   slug?: string;
   *   variantId?: number;
   *   languageId: number;
   * }} input
   */
  async findOneProductVariant(input) {
    const productVariant = await productVariantsFindOneQuery
      .run(
        {
          id: input.variantId,
          slug: input.slug,
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

  /**
   * @param {{
   *   languageId: number;
   * }} input
   */
  async listAll(input) {
    const productVariants = await productVariantsListAllQuery.run(
      {
        language_id: input.languageId,
      },
      this.pool,
    );

    return productVariants;
  }
}

/**
 * @type {TaggedQuery<
 *   import("./queries/product-variants.types").IProductVariantsListAllQueryQuery
 * >}
 */
export const productVariantsListAllQuery = sql`
  SELECT pv.*, 
    pd.name, cd.name as category, 
    cd.category_id, v.name,
    pd.description as description,
    v.name AS vendor FROM product_variants pv
  JOIN product_descriptions pd
    ON pv.product_id = pd.product_id
  JOIN products p
    ON pv.product_id = p.id
  JOIN category_descriptions cd
    ON p.category_id = cd.category_id
  JOIN vendors v
    ON p.vendor_id = v.id
  WHERE pd.language_id = $language_id!
  AND   cd.language_id = $language_id!
  ORDER BY pd.name
`;
