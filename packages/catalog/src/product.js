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
  SELECT p.id, p.category_id, p.slug, pd.name, pd.description FROM products p
  JOIN product_descriptions pd ON p.id = pd.product_id
  WHERE pd.language_id = $language_id!
  ORDER BY p.id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
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
 *   import("./queries/product.types").IProductUpdateQueryQuery
 * >} *
 */
export const productUpdateQuery = sql`
  UPDATE products
  SET
    slug = COALESCE($slug, slug),
    category_id = COALESCE($categoryId, category_id)
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
  SELECT * FROM products
  WHERE id = COALESCE($id, id)
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
  (category_id, slug)
  VALUES
  ($categoryId!, $slug!)
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
            slug: slug,
            categoryId: input.categoryId,
          },
          client,
        )
        .then((res) => res[0]);
      if (!product) {
        throw new Error("Failed to create product");
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

    return {
      ...product,
      descriptions,
    };
  }

  /**
   * @typedef {{
   *   limit?: number;
   *   page?: number;
   *   languageId: number;
   * }} ListProductsProps
   */
  /** @param {ListProductsProps} input */
  async listProducts(input) {
    const products = await productListQuery.run(
      {
        limit: input.limit,
        page: input.page,
        language_id: input.languageId,
      },
      this.pool,
    );
    const count = await productListCountQuery
      .run(undefined, this.pool)
      .then((res) => +(res[0]?.count ?? 0));

    return {
      data: products,
      count: count,
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
      if (input.attributes) {
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
    });
  }
}
