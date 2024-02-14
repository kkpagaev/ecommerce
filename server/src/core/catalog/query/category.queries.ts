/** Types generated for queries found in "src/core/catalog/query/category.sql" */
import { PreparedQuery } from "@pgtyped/runtime";

/** 'ListCategoriesCountQuery' parameters type */
export type IListCategoriesCountQueryParams = void;

/** 'ListCategoriesCountQuery' return type */
export interface IListCategoriesCountQueryResult {
  count: string | null;
}

/** 'ListCategoriesCountQuery' query type */
export interface IListCategoriesCountQueryQuery {
  params: IListCategoriesCountQueryParams;
  result: IListCategoriesCountQueryResult;
}

const listCategoriesCountQueryIR: any = { usedParamSet: {}, params: [], statement: "SELECT COUNT(*) FROM categories" };

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) FROM categories
 * ```
 */
export const listCategoriesCountQuery = new PreparedQuery<IListCategoriesCountQueryParams, IListCategoriesCountQueryResult>(listCategoriesCountQueryIR);

/** 'ListCategoriesQuery' parameters type */
export interface IListCategoriesQueryParams {
  limit?: number | null | void;
  page?: number | null | void;
}

/** 'ListCategoriesQuery' return type */
export interface IListCategoriesQueryResult {
  description: string | null;
  id: number;
  name: string;
  slug: string;
}

/** 'ListCategoriesQuery' query type */
export interface IListCategoriesQueryQuery {
  params: IListCategoriesQueryParams;
  result: IListCategoriesQueryResult;
}

const listCategoriesQueryIR: any = { usedParamSet: { limit: true, page: true }, params: [{ name: "limit", required: false, transform: { type: "scalar" }, locs: [{ a: 78, b: 83 }, { a: 133, b: 138 }] }, { name: "page", required: false, transform: { type: "scalar" }, locs: [{ a: 107, b: 111 }] }], statement: "SELECT id, name, slug, description\nFROM categories\nORDER BY id\nLIMIT COALESCE(:limit, 10)\nOFFSET (COALESCE(:page, 1) - 1) * COALESCE(:limit, 10)" };

/**
 * Query generated from SQL:
 * ```
 * SELECT id, name, slug, description
 * FROM categories
 * ORDER BY id
 * LIMIT COALESCE(:limit, 10)
 * OFFSET (COALESCE(:page, 1) - 1) * COALESCE(:limit, 10)
 * ```
 */
export const listCategoriesQuery = new PreparedQuery<IListCategoriesQueryParams, IListCategoriesQueryResult>(listCategoriesQueryIR);

/** 'FindCategoryByIdQuery' parameters type */
export interface IFindCategoryByIdQueryParams {
  id?: number | null | void;
}

/** 'FindCategoryByIdQuery' return type */
export interface IFindCategoryByIdQueryResult {
  description: string | null;
  id: number;
  name: string;
  slug: string;
}

/** 'FindCategoryByIdQuery' query type */
export interface IFindCategoryByIdQueryQuery {
  params: IFindCategoryByIdQueryParams;
  result: IFindCategoryByIdQueryResult;
}

const findCategoryByIdQueryIR: any = { usedParamSet: { id: true }, params: [{ name: "id", required: false, transform: { type: "scalar" }, locs: [{ a: 62, b: 64 }] }], statement: "SELECT id, name, slug, description FROM categories\nWHERE id = :id" };

/**
 * Query generated from SQL:
 * ```
 * SELECT id, name, slug, description FROM categories
 * WHERE id = :id
 * ```
 */
export const findCategoryByIdQuery = new PreparedQuery<IFindCategoryByIdQueryParams, IFindCategoryByIdQueryResult>(findCategoryByIdQueryIR);

/** 'CreateCategoryQuery' parameters type */
export interface ICreateCategoryQueryParams {
  description?: string | null | void;
  name?: string | null | void;
  slug?: string | null | void;
}

/** 'CreateCategoryQuery' return type */
export interface ICreateCategoryQueryResult {
  id: number;
}

/** 'CreateCategoryQuery' query type */
export interface ICreateCategoryQueryQuery {
  params: ICreateCategoryQueryParams;
  result: ICreateCategoryQueryResult;
}

const createCategoryQueryIR: any = { usedParamSet: { name: true, slug: true, description: true }, params: [{ name: "name", required: false, transform: { type: "scalar" }, locs: [{ a: 61, b: 65 }] }, { name: "slug", required: false, transform: { type: "scalar" }, locs: [{ a: 68, b: 72 }] }, { name: "description", required: false, transform: { type: "scalar" }, locs: [{ a: 75, b: 86 }] }], statement: "INSERT INTO categories\n  (name, slug, description)\nVALUES\n  (:name, :slug, :description)\nRETURNING id" };

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
export const createCategoryQuery = new PreparedQuery<ICreateCategoryQueryParams, ICreateCategoryQueryResult>(createCategoryQueryIR);

/** 'UpdateCategoryQuery' parameters type */
export interface IUpdateCategoryQueryParams {
  description?: string | null | void;
  id?: number | null | void;
  name?: string | null | void;
  slug?: string | null | void;
}

/** 'UpdateCategoryQuery' return type */
export type IUpdateCategoryQueryResult = void;

/** 'UpdateCategoryQuery' query type */
export interface IUpdateCategoryQueryQuery {
  params: IUpdateCategoryQueryParams;
  result: IUpdateCategoryQueryResult;
}

const updateCategoryQueryIR: any = { usedParamSet: { name: true, slug: true, description: true, id: true }, params: [{ name: "name", required: false, transform: { type: "scalar" }, locs: [{ a: 40, b: 44 }] }, { name: "slug", required: false, transform: { type: "scalar" }, locs: [{ a: 72, b: 76 }] }, { name: "description", required: false, transform: { type: "scalar" }, locs: [{ a: 111, b: 122 }] }, { name: "id", required: false, transform: { type: "scalar" }, locs: [{ a: 151, b: 153 }] }], statement: "UPDATE categories\nSET\n  name = COALESCE(:name, name),\n  slug = COALESCE(:slug, slug),\n  description = COALESCE(:description, description)\nWHERE\n  id = :id" };

/**
 * Query generated from SQL:
 * ```
 * UPDATE categories
 * SET
 *   name = COALESCE(:name, name),
 *   slug = COALESCE(:slug, slug),
 *   description = COALESCE(:description, description)
 * WHERE
 *   id = :id
 * ```
 */
export const updateCategoryQuery = new PreparedQuery<IUpdateCategoryQueryParams, IUpdateCategoryQueryResult>(updateCategoryQueryIR);
