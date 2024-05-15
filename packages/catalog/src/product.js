// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";
import { tx } from "@repo/pool";
// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductListQueryQuery
 * >} *
 */
export const productListQuery = sql`
  SELECT p.id, p.category_id, pd.name, pd.description, cd.name as category FROM products p
  JOIN product_descriptions pd ON p.id = pd.product_id
  JOIN categories c ON p.category_id = c.id
  JOIN category_descriptions cd ON c.id = cd.category_id
  WHERE pd.language_id = $language_id!
  AND   cd.language_id = $language_id!
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
 *   import("./queries/product.types").IProductUpdateQueryQuery
 * >} *
 */
export const productUpdateQuery = sql`
  UPDATE products
  SET
    category_id = COALESCE($categoryId, category_id),
    vendor_id = COALESCE($vendorId, vendor_id)
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
  SELECT p.* FROM products p
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
 *   import("./queries/product.types").IProductDescriptionUpsertQueryQuery
 * >} *
 */
export const productDescriptionUpsertQuery = sql`
  INSERT INTO product_descriptions
    (product_id, language_id, name, description, short_description)
  VALUES
    $$values(product_id!, language_id!, name!, description, short_description)
  ON CONFLICT
    (product_id, language_id)
  DO UPDATE
    SET
      name = EXCLUDED.name,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/product.types").IProductCreateQueryQuery
 * >} *
 */
export const productCreateQuery = sql`
  INSERT INTO products
  (category_id, vendor_id)
  VALUES
  ($categoryId!, $vendorId!)
  RETURNING id
`;

export class Products {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @param {{
   *   languageId: number;
   *   categoryId?: number;
   *   attributes: number[];
   *   options: number[];
   *   limit?: number;
   *   offset?: number;
   * }} input
   */
  async paginate(input) {
    // return [];
    // const res = await productPaginateQuery.run(
    //   {
    //     language_id: input.languageId,
    //     categoryId: input.categoryId,
    //     attributes: input.attributes.length > 0 ? input.attributes : undefined,
    //     options: input.options.length > 0 ? input.options : undefined,
    //     limit: input.limit,
    //     offset: input.offset,
    //   },
    //   this.pool,
    // );
    // return res;
  }

  /**
   * @typedef {{
   *   categoryId: number;
   *   attributes: number[];
   *   optionGroups?: number[];
   *   vendorId: number;
   *   descriptions: {
   *     languageId: number;
   *     name: string;
   *     description?: string;
   *     shortDescription?: string;
   *   }[];
   * }} CreateProductProps
   */

  /**
   * @param {CreateProductProps} input
   * @throws Error
   */
  async createProduct(input) {
    return tx(this.pool, async (client) => {
      const product = await productCreateQuery
        .run(
          {
            vendorId: input.vendorId,
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

      const descriptions = await productDescriptionUpsertQuery.run(
        {
          values: input.descriptions.map((d) => ({
            short_description: d.shortDescription,
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

    return {
      ...product,
      attributes: attributeIds,
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
      data: products,
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
      // const name = input.descriptions && input.descriptions[0]?.name;
      await productUpdateQuery.run(
        {
          id: id,
          categoryId: input.categoryId,
        },
        client,
      );

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

      if (input.descriptions) {
        await productDescriptionUpsertQuery.run(
          {
            values: input.descriptions.map((d) => ({
              short_description: d.shortDescription,
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
