import { Pool } from "pg";
import slugify from "slugify";
import {
  IListCategoriesQueryParams,
  createCategoryQuery,
  findCategoryByIdQuery,
  listCategoriesCountQuery,
  listCategoriesQuery,
  updateCategoryQuery,
} from "./category.queries";

export type Categories = ReturnType<typeof Categories>;

export function Categories(f: { pool: Pool }) {
  return {
    listCategories: listCategories.bind(null, f.pool),
    findCategoryById: findCategoryById.bind(null, f.pool),
    createCategory: createCategory.bind(null, f.pool),
    updateCategory: updateCategory.bind(null, f.pool),
  };
}

export async function listCategories(pool: Pool, input: IListCategoriesQueryParams) {
  const res = await listCategoriesQuery.run(
    {
      page: input.page,
      limit: input.limit,
    },
    pool
  );
  const count = await listCategoriesCountQuery.run(undefined, pool);

  return {
    data: res,
    count: +(count[0].count ?? 0),
  };
}

export async function findCategoryById(pool: Pool, id: number) {
  const res = await findCategoryByIdQuery.run({ id }, pool);

  return res[0];
}

type CreateCategoryProps = {
  name: string;
  description?: string;
};
export async function createCategory(pool: Pool, input: CreateCategoryProps) {
  const slug = slugify(input.name);
  const res = await createCategoryQuery.run({
    ...input,
    slug,
  }, pool);

  return res[0];
}

type UpdateCategoryProps = {
  name?: string;
  description?: string;
};
export async function updateCategory(pool: Pool, id: number, input: UpdateCategoryProps) {
  const slug = input.name ? slugify(input.name) : undefined;

  return await updateCategoryQuery.run({
    ...input,
    slug,
    id,
  }, pool);
}
