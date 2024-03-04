import { Pool, PoolClient } from "pg";
import { catalogQueries as q } from "./queries";
import slugify from "slugify";
import { tx } from "@repo/pool";
import { Translation } from "./i18n";

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

type CreateProductProps = {
  categoryId: number;
  name: Translation;
  price: number;
  attributes?: Array<number>;
  description?: Translation;
};
async function createProduct(
  pool: Pool,
  input: CreateProductProps,
) {
  const slug = slugify(input.name.uk);

  return tx(pool, async (client) => {
    const product = await q.product.create.run({
      description: input.description,
      name: input.name,
      slug: slug,
      categoryId: input.categoryId,
    }, client).then((res) => res[0]);
    if (!product) {
      throw new Error("Failed to create product");
    }

    await q.price.upsert.run({
      values: [
        {
          price: input.price,
          type: "default",
          product_id: product.id,
        },
      ],
    }, client);

    if (input.attributes) {
      await upsertAttributes(client, product.id, input.attributes);
    }

    return product;
  });
}

type FindOneProductProps = {
  id?: number;
};
export async function findOneProduct(pool: Pool, props: FindOneProductProps) {
  const product = await q.product.findOne.run({
    id: props.id,
  }, pool).then((res) => res[0]);
  if (!product) {
    return null;
  }
  const attributes = await q.productAttributeValue.list.run({
    productId: product.id,
  }, pool);

  return {
    ...product,
    attributes,
  };
}

async function upsertAttributes(client: PoolClient, id: number, attributes: Array<number>) {
  await q.productAttributeValue.delete.run({
    product_id: id,
  }, client);
  if (attributes.length !== 0) {
    await q.productAttributeValue.create.run({
      values: attributes.map((attrId) => ({
        attributeValueId: attrId,
        productId: id,
      })),
    }, client);
  }
}

type UpdateProductProps = Partial<CreateProductProps>;
async function updateProduct(
  pool: Pool,
  id: number,
  input: UpdateProductProps,
) {
  const slug = input.name?.uk && slugify(input.name.uk);

  return tx(pool, async (client) => {
    await q.product.update.run({
      id: id,
      name: input.name,
      description: input.description,
      slug: slug,
      categoryId: input.categoryId,
    }, client);
    if (input.price) {
      await q.price.upsert.run({
        values: [
          { price: input.price, type: "default", product_id: id },
        ],
      }, client);
    }
    if (input.attributes) {
      await upsertAttributes(client, id, input.attributes);
    }
  });
}

type DeleteProductProps = {
  id: number;
};
export async function deleteProduct(
  pool: Pool, props: DeleteProductProps
): Promise<number | undefined> {
  return q.product.delete.run({
    id: props.id,
  }, pool).then((res) => res[0]?.id);
}

type ListProductsProps = {
  limit?: number;
  page?: number;
};
export async function listProducts(pool: Pool, input: ListProductsProps) {
  const products = await q.product.list.run({
    limit: input.limit,
    page: input.page,
  }, pool);
  const count = await q.product.listCount.run(undefined, pool)
    .then((res) => +(res[0]?.count ?? 0));

  return {
    data: products,
    count: count,
  };
}
