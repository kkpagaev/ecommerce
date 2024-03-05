import { Pool } from "pg";
import slugify from "slugify";
import { tx } from "@repo/pool";
import { sql } from "@pgtyped/runtime";
import { IProductUpdateQueryQuery, IProductListCountQueryQuery, IProductListQueryQuery, IProductAttributesUpsertQueryQuery, IProductDescriptionFindQueryQuery, IProductFindOneQueryQuery, IProductCreateQueryQuery, IPriceUpsertQueryQuery, IProductDescriptionUpsertQueryQuery, IProductDeleteQueryQuery } from "./product.types";

export type Products = ReturnType<typeof Products>;
export function Products(f: { pool: Pool }) {
  return {
    listProducts: listProducts.bind(null, f.pool),
    deleteProduct: deleteProduct.bind(null, f.pool),
    findOneProduct: findOneProduct.bind(null, f.pool),
    createProduct: createProduct.bind(null, f.pool),
    updateProduct: updateProduct.bind(null, f.pool),
  };
}

export const productAttributesUpsertQuery = sql<IProductAttributesUpsertQueryQuery>`
  INSERT INTO product_attributes
    (product_id, attribute_id)
  VALUES
    $$values(product_id!, attribute_id!)
  ON CONFLICT DO NOTHING;
`;
export const priceUpsertQuery = sql<IPriceUpsertQueryQuery>`
  INSERT INTO prices (product_id, price, type)
  VALUES $$values(product_id!, price!, type)
  ON CONFLICT (product_id, type)
  DO UPDATE SET price = EXCLUDED.price;
`;
export const productDescriptionUpsertQuery = sql<IProductDescriptionUpsertQueryQuery>`
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
export const productCreateQuery = sql<IProductCreateQueryQuery>`
  INSERT INTO products
  (category_id, slug)
  VALUES
  ($categoryId!, $slug!)
  RETURNING id
`;

type CreateProductProps = {
  categoryId: number;
  price: number;
  attributes: Array<number>;
  descriptions: Array<{
    languageId: number;
    name: string;
    description?: string;
  }>;
};
async function createProduct(
  pool: Pool,
  input: CreateProductProps,
) {
  const slug = (input.descriptions[0]?.name && slugify(input.descriptions[0].name)) || "";

  return tx(pool, async (client) => {
    const product = await productCreateQuery.run({
      slug: slug,
      categoryId: input.categoryId,
    }, client).then((res) => res[0]);
    if (!product) {
      throw new Error("Failed to create product");
    }

    const price = await priceUpsertQuery.run({
      values: [
        {
          price: input.price,
          type: "default",
          product_id: product.id,
        },
      ],
    }, client);
    const descriptions = await productDescriptionUpsertQuery.run({
      values: input.descriptions.map((d) => ({
        description: d.description,
        product_id: product.id,
        name: d.name,
        language_id: d.languageId,
      })),
    }, client);

    await productAttributesUpsertQuery.run({
      values: input.attributes.map((a) => ({
        product_id: product.id,
        attribute_id: a,
      })),
    }, client);

    return {
      ...product,
      price,
      descriptions,
    };
  });
}

export const productFindOneQuery = sql<IProductFindOneQueryQuery>`
  SELECT * FROM products
  WHERE id = COALESCE($id, id)
  LIMIT 1;
`;

export const productDescriptionFindQuery = sql<IProductDescriptionFindQueryQuery>`
  SELECT * FROM product_descriptions
  WHERE product_id = $product_id!
`;

type FindOneProductProps = {
  id?: number;
};
export async function findOneProduct(pool: Pool, props: FindOneProductProps) {
  const product = await productFindOneQuery.run({
    id: props.id,
  }, pool).then((res) => res[0]);
  if (!product) {
    return null;
  }
  const descriptions = await productDescriptionFindQuery.run({
    product_id: product.id,
  }, pool);

  return {
    ...product,
    descriptions,
  };
}

export const productUpdateQuery = sql<IProductUpdateQueryQuery>`
  UPDATE products
  SET
    slug = COALESCE($slug, slug),
    category_id = COALESCE($categoryId, category_id)
  WHERE
    id = $id!;
`;

type UpdateProductProps = Partial<CreateProductProps>;
async function updateProduct(
  pool: Pool,
  id: number,
  input: UpdateProductProps,
) {
  return tx(pool, async (client) => {
    const name = input.descriptions && input.descriptions[0]?.name;
    const slug = name && slugify(name);
    await productUpdateQuery.run({
      id: id,
      slug: slug,
      categoryId: input.categoryId,
    }, client);
    if (input.price) {
      await priceUpsertQuery.run({
        values: [
          { price: input.price, type: "default", product_id: id },
        ],
      }, client);
    }
    if (input.attributes) {
      await productAttributesUpsertQuery.run({
        values: input.attributes.map((a) => ({
          attribute_id: a,
          product_id: id,
        })),
      }, client);
    }
  });
}

export const productDeleteQuery = sql<IProductDeleteQueryQuery>`
  DELETE FROM products
  WHERE id = $id!
  RETURNING id;
`;
type DeleteProductProps = {
  id: number;
};
export async function deleteProduct(
  pool: Pool, props: DeleteProductProps
): Promise<number | undefined> {
  return await productDeleteQuery.run({
    id: props.id,
  }, pool).then((res) => res[0]?.id);
}

export const productListQuery = sql<IProductListQueryQuery>`
  SELECT p.id, p.category_id, p.slug, pd.name, pd.description FROM products p
  JOIN product_descriptions pd ON p.id = pd.product_id
  WHERE pd.language_id = $language_id!
  ORDER BY p.id
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

export const productListCountQuery = sql<IProductListCountQueryQuery>`
  SELECT COUNT(*) FROM products
`;
type ListProductsProps = {
  limit?: number;
  page?: number;
  languageId: number;
};
export async function listProducts(pool: Pool, input: ListProductsProps) {
  const products = await productListQuery.run({
    limit: input.limit,
    page: input.page,
    language_id: input.languageId,
  }, pool);
  const count = await productListCountQuery.run(undefined, pool)
    .then((res) => +(res[0]?.count ?? 0));

  return {
    data: products,
    count: count,
  };
}
