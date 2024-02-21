import { Pool } from "pg";
import slugify from "slugify";
import { Translation } from "./i18n";
import { categoryCreateQuery, categoryFindByIdQuery, categoryListCountQuery, categoryListQuery, categoryUpdateQuery } from "./queries";
import { ICategoryListQueryParams } from "./queries.types";

export type Categories = ReturnType<typeof Categories>;

export function Categories(f: { pool: Pool }) {
  return {
    listCategories: listCategories.bind(null, f.pool),
    findCategoryById: findCategoryById.bind(null, f.pool),
    createCategory: createCategory.bind(null, f.pool),
    updateCategory: updateCategory.bind(null, f.pool),
  };
}

export async function listCategories(pool: Pool, input: ICategoryListQueryParams) {
  const res = await categoryListQuery.run(
    {
      page: input.page,
      limit: input.limit,
    },
    pool
  );
  const count = await categoryListCountQuery.run(undefined, pool);

  return {
    data: res,
    count: +(count[0].count ?? 0),
  };
}

export async function findCategoryById(pool: Pool, id: number) {
  const res = await categoryFindByIdQuery.run({ id }, pool);

  return res[0];
}

type CreateCategoryProps = {
  name: Translation;
  description?: Translation;
};
export async function createCategory(pool: Pool, input: CreateCategoryProps) {
  const slug = slugify(input.name.uk);
  const res = await categoryCreateQuery.run({
    ...input,
    slug,
  }, pool);

  return res[0];
}

type UpdateCategoryProps = {
  name?: Translation;
  description?: Translation;
};
export async function updateCategory(pool: Pool, id: number, input: UpdateCategoryProps) {
  const slug = input.name ? slugify(input.name.uk) : undefined;

  return await categoryUpdateQuery.run({
    ...input,
    slug,
    id,
  }, pool);
}
