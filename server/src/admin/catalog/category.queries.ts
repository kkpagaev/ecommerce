/** Types generated for queries found in "src/admin/catalog/category.sql" */
import { PreparedQuery } from "@pgtyped/runtime";

/** 'ListCategories' parameters type */
export type IListCategoriesParams = void;

/** 'ListCategories' return type */
export interface IListCategoriesResult {
  description: string | null;
  id: number;
  name: string;
  slug: string;
}

/** 'ListCategories' query type */
export interface IListCategoriesQuery {
  params: IListCategoriesParams;
  result: IListCategoriesResult;
}

const listCategoriesIR: any = {
  usedParamSet: {},
  params: [],
  statement: "SELECT id, name, slug, description FROM categories\nORDER BY id",
};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, name, slug, description FROM categories
 * ORDER BY id
 * ```
 */
export const listCategories = new PreparedQuery<
  IListCategoriesParams,
  IListCategoriesResult
>(listCategoriesIR);

/** 'FindCategoryById' parameters type */
export interface IFindCategoryByIdParams {
  id?: number | null | void;
}

/** 'FindCategoryById' return type */
export interface IFindCategoryByIdResult {
  description: string | null;
  id: number;
  name: string;
  slug: string;
}

/** 'FindCategoryById' query type */
export interface IFindCategoryByIdQuery {
  params: IFindCategoryByIdParams;
  result: IFindCategoryByIdResult;
}

const findCategoryByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: "id",
      required: false,
      transform: { type: "scalar" },
      locs: [{ a: 62, b: 64 }],
    },
  ],
  statement:
    "SELECT id, name, slug, description FROM categories\nWHERE id = :id",
};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, name, slug, description FROM categories
 * WHERE id = :id
 * ```
 */
export const findCategoryById = new PreparedQuery<
  IFindCategoryByIdParams,
  IFindCategoryByIdResult
>(findCategoryByIdIR);

/** 'CreateCategory' parameters type */
export interface ICreateCategoryParams {
  description?: string | null | void;
  name?: string | null | void;
  slug?: string | null | void;
}

/** 'CreateCategory' return type */
export interface ICreateCategoryResult {
  id: number;
}

/** 'CreateCategory' query type */
export interface ICreateCategoryQuery {
  params: ICreateCategoryParams;
  result: ICreateCategoryResult;
}

const createCategoryIR: any = {
  usedParamSet: { name: true, slug: true, description: true },
  params: [
    {
      name: "name",
      required: false,
      transform: { type: "scalar" },
      locs: [{ a: 61, b: 65 }],
    },
    {
      name: "slug",
      required: false,
      transform: { type: "scalar" },
      locs: [{ a: 68, b: 72 }],
    },
    {
      name: "description",
      required: false,
      transform: { type: "scalar" },
      locs: [{ a: 75, b: 86 }],
    },
  ],
  statement:
    "INSERT INTO categories\n  (name, slug, description)\nVALUES\n  (:name, :slug, :description)\nRETURNING id",
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO categories
 *   (name, slug, description)
 * VALUES
 *   (:name, :slug, :description)
 * RETURNING id
 * ```
 */
export const createCategory = new PreparedQuery<
  ICreateCategoryParams,
  ICreateCategoryResult
>(createCategoryIR);
