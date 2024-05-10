// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";
import slugify from "slugify";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductListQueryQuery
 * >} *
 */
export const productListQuery = sql`
  SELECT p.id, p.category_id, p.images, p.slug, pd.name, pd.description FROM products p
  JOIN product_descriptions pd ON p.id = pd.product_id
  WHERE pd.language_id = $language_id!
  ORDER BY p.id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductAttributeListQueryQuery
 * >}
 */
export const productAttributeListQuery = sql`
  SELECT attribute_id as id FROM product_attributes
  WHERE product_id = $product_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductListCountQueryQuery
 * >} *
 */
export const productListCountQuery = sql`
  SELECT COUNT(*) FROM products
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductOptionGroupsListQueryQuery
 * >}
 */
export const productOptionGroupsListQuery = sql`
  SELECT option_group_id as id FROM product_option_groups
  WHERE product_id = $product_id!
`;
/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductOptionsListQueryQuery
 * >}
 */
export const productOptionsListQuery = sql`
  SELECT option_id as id FROM product_options
  WHERE product_id = $product_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductUpdateQueryQuery
 * >} *
 */
export const productUpdateQuery = sql`
  UPDATE products
  SET
    slug = COALESCE($slug, slug),
    category_id = COALESCE($categoryId, category_id),
    images = COALESCE($images, images)
  WHERE
    id = $id!;
`;
/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductDeleteQueryQuery
 * >} *
 */
export const productDeleteQuery = sql`
  DELETE FROM products
  WHERE id = $id!
  RETURNING id;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductFindOneQueryQuery
 * >} *
 */
export const productFindOneQuery = sql`
  SELECT p.*, pr.price FROM products p
  JOIN prices pr ON p.id = pr.product_id
  WHERE p.id = COALESCE($id, p.id)
  LIMIT 1;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductDescriptionFindQueryQuery
 * >} *
 */
export const productDescriptionFindQuery = sql`
  SELECT * FROM product_descriptions
  WHERE product_id = $product_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductAttributesDeleteQueryQuery
 * >}
 */
export const productAttributesDeleteQuery = sql`
  DELETE FROM product_attributes
  WHERE product_id = $product_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductOptionGroupsDeleteQueryQuery
 * >}
 */
export const productOptionGroupsDeleteQuery = sql`
  DELETE FROM product_option_groups
  WHERE product_id = $product_id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductOptionGroupsUpsertQueryQuery
 * >}
 */
export const productOptionGroupsUpsertQuery = sql`
  INSERT INTO product_option_groups
    (product_id, option_group_id)
  VALUES
    $$values(product_id!, option_group_id!)
  ON CONFLICT DO NOTHING;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductAttributesUpsertQueryQuery
 * >} *
 */
export const productAttributesUpsertQuery = sql`
  INSERT INTO product_attributes
    (product_id, attribute_id)
  VALUES
    $$values(product_id!, attribute_id!)
  ON CONFLICT DO NOTHING;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductOptionsDeleteQueryQuery
 * >}
 */
export const productOptionsDeleteQuery = sql`
  DELETE FROM product_options
  WHERE product_id = $product_id!
`;
/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductOptionsUpsertQueryQuery
 * >}
 */
export const productOptionsUpsertQuery = sql`
  INSERT INTO product_options
    (product_id, option_id)
  VALUES
    $$values(product_id!, option_id!)
  ON CONFLICT DO NOTHING;
`;
/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IPriceUpsertQueryQuery
 * >} *
 */
export const priceUpsertQuery = sql`
  INSERT INTO prices (product_id, price, type)
  VALUES $$values(product_id!, price!, type)
  ON CONFLICT (product_id, type)
  DO UPDATE SET price = EXCLUDED.price;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductDescriptionUpsertQueryQuery
 * >} *
 */
export const productDescriptionUpsertQuery = sql`
  INSERT INTO product_descriptions
    (product_id, language_id, name, description)
  VALUES
    $$values(product_id!, language_id!, name!, description)
  ON CONFLICT
    (product_id, language_id)
  DO UPDATE
    SET
      name = EXCLUDED.name,
      description = EXCLUDED.description;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductCreateQueryQuery
 * >} *
 */
export const productCreateQuery = sql`
  INSERT INTO products
  (category_id, slug, images)
  VALUES
  ($categoryId!, $slug!, $images!)
  RETURNING id
`;

export class Products {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   categoryId: number;
   *   price: number;
   *   attributes: number[];
   *   images: string[];
   *   optionGroups?: number[];
   *   options?: number[];
   *   descriptions: {
   *     languageId: number;
   *     name: string;
   *     description?: string;
   *   }[];
   * }} CreateProductProps
   */

  /**
   * @param {CreateProductProps} input
   * @throws Error
   */
  async createProduct(input) {
    const slug =
      (input.descriptions[0]?.name && slugify(input.descriptions[0].name)) ||
      "";

    return tx(this.pool, async (client) => {
      const product = await productCreateQuery
        .run(
          {
            images: JSON.stringify(input.images),
            slug: slug,
            categoryId: input.categoryId,
          },
          client,
        )
        .then((res) => res[0]);
      if (!product) {
        throw new Error("Failed to create product");
      }

      if (input.optionGroups) {
        await productOptionGroupsUpsertQuery.run(
          {
            values: input.optionGroups.map((o) => ({
              product_id: product.id,
              option_group_id: o,
            })),
          },
          client,
        );
      }

      if (input.options) {
        await productOptionsUpsertQuery.run(
          {
            values: input.options.map((o) => ({
              product_id: product.id,
              option_id: o,
            })),
          },
          client,
        );
      }

      const price = await priceUpsertQuery.run(
        {
          values: [
            {
              price: input.price,
              type: "default",
              product_id: product.id,
            },
          ],
        },
        client,
      );
      const descriptions = await productDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            description: d.description,
            product_id: product.id,
            name: d.name,
            language_id: d.languageId,
          })),
        },
        client,
      );

      await productAttributesUpsertQuery.run(
        {
          values: input.attributes.map((a) => ({
            product_id: product.id,
            attribute_id: a,
          })),
        },
        client,
      );

      return {
        ...product,
        price,
        descriptions,
      };
    });
  }

  /**
   * @typedef {{
   *   id?: number;
   * }} FindOneProductProps
   */
  /** @param {FindOneProductProps} props */
  async findOneProduct(props) {
    const product = await productFindOneQuery
      .run(
        {
          id: props.id,
        },
        this.pool,
      )
      .then((res) => res[0]);
    if (!product) {
      return null;
    }
    const descriptions = await productDescriptionFindQuery.run(
      {
        product_id: product.id,
      },
      this.pool,
    );
    const attributeIds = await productAttributeListQuery
      .run(
        {
          product_id: product.id,
        },
        this.pool,
      )
      .then((res) => res.map(({ id }) => id));

    const optionGroupsIds = await productOptionGroupsListQuery
      .run(
        {
          product_id: product.id,
        },
        this.pool,
      )
      .then((r) => r.map((option) => option.id));
    const optionIds = await productOptionsListQuery
      .run(
        {
          product_id: product.id,
        },
        this.pool,
      )
      .then((r) => r.map((option) => option.id));

    /** @type {string[]} */
    const images = /** @type {any} */ (product.images);

    return {
      ...product,
      images,
      price: Number(product.price),
      attributes: attributeIds,
      options: optionIds,
      optionGroups: optionGroupsIds,
      descriptions,
    };
  }

  /**
   * @typedef {{
   *   languageId: number;
   * }} ListProductsProps
   */
  /** @param {ListProductsProps} input */
  async listProducts(input) {
    const products = await productListQuery.run(
      {
        language_id: input.languageId,
      },
      this.pool,
    );
    // const count = await productListCountQuery
    //   .run(undefined, this.pool)
    //   .then((res) => +(res[0]?.count ?? 0));

    return {
      data: products.map((p) => {
        /** @type {string[]} */
        const images = /** @type {any} */ (p.images);

        return {
          ...p,
          images: images,
        };
      }),
      count: products.length,
    };
  }

  /**
   * @typedef {{
   *   id: number;
   * }} DeleteProductProps
   */
  /** @param {DeleteProductProps} props */
  async deleteProduct(props) {
    return await productDeleteQuery
      .run(
        {
          id: props.id,
        },
        this.pool,
      )
      .then((res) => res[0]?.id);
  }

  /** @typedef {Partial<CreateProductProps>} UpdateProductProps */
  /**
   * @param {number} id
   * @param {UpdateProductProps} input
   */
  async updateProduct(id, input) {
    return tx(this.pool, async (client) => {
      const name = input.descriptions && input.descriptions[0]?.name;
      const slug = name && slugify(name);
      await productUpdateQuery.run(
        {
          id: id,
          slug: slug,
          images: JSON.stringify(input.images),
          categoryId: input.categoryId,
        },
        client,
      );
      if (input.price) {
        await priceUpsertQuery.run(
          {
            values: [{ price: input.price, type: "default", product_id: id }],
          },
          client,
        );
      }

      if (input.optionGroups) {
        await productOptionGroupsDeleteQuery.run(
          {
            product_id: id,
          },
          client,
        );

        if (input.optionGroups.length > 0) {
          await productOptionGroupsUpsertQuery.run(
            {
              values: input.optionGroups.map((o) => ({
                product_id: id,
                option_group_id: o,
              })),
            },
            client,
          );
        }
      }

      if (input.options) {
        await productOptionsDeleteQuery.run(
          {
            product_id: id,
          },
          client,
        );
        if (input.options.length > 0) {
          await productOptionsUpsertQuery.run(
            {
              values: input.options.map((o) => ({
                product_id: id,
                option_id: o,
              })),
            },
            client,
          );
        }
      }
      if (input.descriptions) {
        await productDescriptionUpsertQuery.run(
          {
            values: input.descriptions.map((d) => ({
              description: d.description,
              product_id: id,
              name: d.name,
              language_id: d.languageId,
            })),
          },
          client,
        );
      }
      if (input.attributes) {
        await productAttributesDeleteQuery.run(
          {
            product_id: id,
          },
          client,
        );
        if (input.attributes.length > 0) {
          await productAttributesUpsertQuery.run(
            {
              values: input.attributes.map((a) => ({
                attribute_id: a,
                product_id: id,
              })),
            },
            client,
          );
        }
      }
    });
  }
}
