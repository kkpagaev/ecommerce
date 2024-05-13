/** Types generated for queries found in "src/category.js" */

/** 'CategoryUpdateQuery' parameters type */
export interface ICategoryUpdateQueryParams {
  id: number;
  image?: string | null | void;
  parentId?: number | null | void;
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

/** 'CategoryListQuery' parameters type */
export interface ICategoryListQueryParams {
  language_id: number;
  name?: string | null | void;
}

/** 'CategoryListQuery' return type */
export interface ICategoryListQueryResult {
  category_id: number;
  id: number;
  image_url: string;
  language_id: number;
  name: string;
  parent_id: number | null;
  slug: string;
}

/** 'CategoryListQuery' query type */
export interface ICategoryListQueryQuery {
  params: ICategoryListQueryParams;
  result: ICategoryListQueryResult;
}

/** 'CategoryFindOneQuery' parameters type */
export interface ICategoryFindOneQueryParams {
  id?: number | null | void;
  slug?: string | null | void;
}

/** 'CategoryFindOneQuery' return type */
export interface ICategoryFindOneQueryResult {
  id: number;
  image_id: string;
  image_url: string;
  parent_id: number | null;
  slug: string;
}

/** 'CategoryFindOneQuery' query type */
export interface ICategoryFindOneQueryQuery {
  params: ICategoryFindOneQueryParams;
  result: ICategoryFindOneQueryResult;
}

/** 'CategoryFindOneWithDescriptionQuery' parameters type */
export interface ICategoryFindOneWithDescriptionQueryParams {
  id?: number | null | void;
  language_id: number;
  slug?: string | null | void;
}

/** 'CategoryFindOneWithDescriptionQuery' return type */
export interface ICategoryFindOneWithDescriptionQueryResult {
  id: number;
  image_id: string;
  image_url: string;
  name: string;
  slug: string;
}

/** 'CategoryFindOneWithDescriptionQuery' query type */
export interface ICategoryFindOneWithDescriptionQueryQuery {
  params: ICategoryFindOneWithDescriptionQueryParams;
  result: ICategoryFindOneWithDescriptionQueryResult;
}

/** 'CategoryDescriptionListQuery' parameters type */
export interface ICategoryDescriptionListQueryParams {
  category_id: number;
}

/** 'CategoryDescriptionListQuery' return type */
export interface ICategoryDescriptionListQueryResult {
  category_id: number;
  language_id: number;
  language_name: string;
  name: string;
}

/** 'CategoryDescriptionListQuery' query type */
export interface ICategoryDescriptionListQueryQuery {
  params: ICategoryDescriptionListQueryParams;
  result: ICategoryDescriptionListQueryResult;
}

/** 'CategoryCreateQuery' parameters type */
export interface ICategoryCreateQueryParams {
  image?: string | null | void;
  parentId?: number | null | void;
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

