/** Types generated for queries found in "src/category.ts" */

/** 'CategoryListQuery' parameters type */
export interface ICategoryListQueryParams {
  language_id: number;
  limit?: number | null | void;
  page?: number | null | void;
}

/** 'CategoryListQuery' return type */
export interface ICategoryListQueryResult {
  category_id: number;
  id: number;
  language_id: number;
  name: string;
  slug: string;
}

/** 'CategoryListQuery' query type */
export interface ICategoryListQueryQuery {
  params: ICategoryListQueryParams;
  result: ICategoryListQueryResult;
}

/** 'CategoryListCountQuery' parameters type */
export type ICategoryListCountQueryParams = void;

/** 'CategoryListCountQuery' return type */
export interface ICategoryListCountQueryResult {
  count: string | null;
}

/** 'CategoryListCountQuery' query type */
export interface ICategoryListCountQueryQuery {
  params: ICategoryListCountQueryParams;
  result: ICategoryListCountQueryResult;
}

/** 'CategoryFindOneQuery' parameters type */
export interface ICategoryFindOneQueryParams {
  id?: number | null | void;
  slug?: string | null | void;
}

/** 'CategoryFindOneQuery' return type */
export interface ICategoryFindOneQueryResult {
  id: number;
  slug: string;
}

/** 'CategoryFindOneQuery' query type */
export interface ICategoryFindOneQueryQuery {
  params: ICategoryFindOneQueryParams;
  result: ICategoryFindOneQueryResult;
}

/** 'CategoryDescriptionListQuery' parameters type */
export interface ICategoryDescriptionListQueryParams {
  category_id: number;
}

/** 'CategoryDescriptionListQuery' return type */
export interface ICategoryDescriptionListQueryResult {
  categoryId: number;
  languageId: number;
  name: string;
}

/** 'CategoryDescriptionListQuery' query type */
export interface ICategoryDescriptionListQueryQuery {
  params: ICategoryDescriptionListQueryParams;
  result: ICategoryDescriptionListQueryResult;
}

/** 'CategoryCreateQuery' parameters type */
export interface ICategoryCreateQueryParams {
  slug: string;
}

/** 'CategoryCreateQuery' return type */
export interface ICategoryCreateQueryResult {
  id: number;
}

/** 'CategoryCreateQuery' query type */
export interface ICategoryCreateQueryQuery {
  params: ICategoryCreateQueryParams;
  result: ICategoryCreateQueryResult;
}

/** 'CategoryDescriptionUpsertQuery' parameters type */
export interface ICategoryDescriptionUpsertQueryParams {
  values: readonly ({
    category_id: number,
    language_id: number,
    name: string
  })[];
}

/** 'CategoryDescriptionUpsertQuery' return type */
export interface ICategoryDescriptionUpsertQueryResult {
  category_id: number;
  language_id: number;
  name: string;
}

/** 'CategoryDescriptionUpsertQuery' query type */
export interface ICategoryDescriptionUpsertQueryQuery {
  params: ICategoryDescriptionUpsertQueryParams;
  result: ICategoryDescriptionUpsertQueryResult;
}

/** 'CategoryUpdateQuery' parameters type */
export interface ICategoryUpdateQueryParams {
  id: number;
  slug?: string | null | void;
}

/** 'CategoryUpdateQuery' return type */
export interface ICategoryUpdateQueryResult {
  id: number;
}

/** 'CategoryUpdateQuery' query type */
export interface ICategoryUpdateQueryQuery {
  params: ICategoryUpdateQueryParams;
  result: ICategoryUpdateQueryResult;
}

