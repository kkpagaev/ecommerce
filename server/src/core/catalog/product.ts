import { Translation } from "./i18n";
import { Pool } from "pg";
import { catalogQueries as q } from "./queries";
import slugify from "slugify";
import { tx } from "../../plugins/pool";

export type Products = ReturnType<typeof Products>;
export function Products(f: { pool: Pool }) {
  return {
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

    await q.price.upsert.run({
      values: [
        {
          price: input.price,
          type: "default",
          product_id: product.id,
        },
      ],
    }, client);

    await q.productAttributeValue.create.run({
      values: input.attributes?.map((id) => ({
        productId: product.id,
        attributeValueId: id,
      })) ?? [],
    }, client);

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
  const attributes = await q.productAttributeValue.list.run({
    productId: product.id,
  }, pool);

  return {
    ...product,
    attributes,
  };
}

type UpdateProductProps = Partial<CreateProductProps>;
async function updateProduct(
  pool: Pool,
  id: number,
  input: UpdateProductProps,
) {
  return null;
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
