import { Translation } from "./i18n";
import { Pool } from "pg";

export type Products = ReturnType<typeof Products>;
export function Products(f: { pool: Pool }) {
  return {
    createProduct: createProduct.bind(null, f.pool),
    updateProduct: updateProduct.bind(null, f.pool),
  };
}

type CreateProductProps = {
  name: Translation;
  price: number;
  description?: Translation;
};
async function createProduct(
  pool: Pool,
  input: CreateProductProps,
) {
  return null;
}

type UpdateProductProps = Partial<CreateProductProps>;
async function updateProduct(
  pool: Pool,
  id: number,
  input: UpdateProductProps,
) {
  return null;
}
