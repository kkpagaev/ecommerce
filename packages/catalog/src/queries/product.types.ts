/** Types generated for queries found in "src/product.js" */
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

/** 'ProductListQuery' parameters type */
export interface IProductListQueryParams {
  language_id: number;
}

/** 'ProductListQuery' return type */
export interface IProductListQueryResult {
  category_id: number;
  description: string | null;
  id: number;
  images: Json | null;
  name: string;
  slug: string;
}

/** 'ProductListQuery' query type */
export interface IProductListQueryQuery {
  params: IProductListQueryParams;
  result: IProductListQueryResult;
}

/** 'ProductAttributeListQuery' parameters type */
export interface IProductAttributeListQueryParams {
  product_id: number;
}

/** 'ProductAttributeListQuery' return type */
export interface IProductAttributeListQueryResult {
  id: number;
}

/** 'ProductAttributeListQuery' query type */
export interface IProductAttributeListQueryQuery {
  params: IProductAttributeListQueryParams;
  result: IProductAttributeListQueryResult;
}

/** 'ProductListCountQuery' parameters type */
export type IProductListCountQueryParams = void;

/** 'ProductListCountQuery' return type */
export interface IProductListCountQueryResult {
  count: string | null;
}

/** 'ProductListCountQuery' query type */
export interface IProductListCountQueryQuery {
  params: IProductListCountQueryParams;
  result: IProductListCountQueryResult;
}

/** 'ProductUpdateQuery' parameters type */
export interface IProductUpdateQueryParams {
  categoryId?: number | null | void;
  id: number;
  images?: Json | null | void;
  slug?: string | null | void;
}

/** 'ProductUpdateQuery' return type */
export type IProductUpdateQueryResult = void;

/** 'ProductUpdateQuery' query type */
export interface IProductUpdateQueryQuery {
  params: IProductUpdateQueryParams;
  result: IProductUpdateQueryResult;
}

/** 'ProductDeleteQuery' parameters type */
export interface IProductDeleteQueryParams {
  id: number;
}

/** 'ProductDeleteQuery' return type */
export interface IProductDeleteQueryResult {
  id: number;
}

/** 'ProductDeleteQuery' query type */
export interface IProductDeleteQueryQuery {
  params: IProductDeleteQueryParams;
  result: IProductDeleteQueryResult;
}

/** 'ProductFindOneQuery' parameters type */
export interface IProductFindOneQueryParams {
  id?: number | null | void;
}

/** 'ProductFindOneQuery' return type */
export interface IProductFindOneQueryResult {
  category_id: number;
  created_at: Date;
  id: number;
  images: Json | null;
  price: string | null;
  slug: string;
  updated_at: Date;
}

/** 'ProductFindOneQuery' query type */
export interface IProductFindOneQueryQuery {
  params: IProductFindOneQueryParams;
  result: IProductFindOneQueryResult;
}

/** 'ProductDescriptionFindQuery' parameters type */
export interface IProductDescriptionFindQueryParams {
  product_id: number;
}

/** 'ProductDescriptionFindQuery' return type */
export interface IProductDescriptionFindQueryResult {
  description: string | null;
  language_id: number;
  name: string;
  product_id: number;
}

/** 'ProductDescriptionFindQuery' query type */
export interface IProductDescriptionFindQueryQuery {
  params: IProductDescriptionFindQueryParams;
  result: IProductDescriptionFindQueryResult;
}

/** 'ProductAttributesUpsertQuery' parameters type */
export interface IProductAttributesUpsertQueryParams {
  values: readonly ({
    product_id: number,
    attribute_id: number
  })[];
}

/** 'ProductAttributesUpsertQuery' return type */
export type IProductAttributesUpsertQueryResult = void;

/** 'ProductAttributesUpsertQuery' query type */
export interface IProductAttributesUpsertQueryQuery {
  params: IProductAttributesUpsertQueryParams;
  result: IProductAttributesUpsertQueryResult;
}

/** 'PriceUpsertQuery' parameters type */
export interface IPriceUpsertQueryParams {
  values: readonly ({
    product_id: NumberOrString,
    price: NumberOrString,
    type: string | null | void
  })[];
}

/** 'PriceUpsertQuery' return type */
export type IPriceUpsertQueryResult = void;

/** 'PriceUpsertQuery' query type */
export interface IPriceUpsertQueryQuery {
  params: IPriceUpsertQueryParams;
  result: IPriceUpsertQueryResult;
}

/** 'ProductDescriptionUpsertQuery' parameters type */
export interface IProductDescriptionUpsertQueryParams {
  values: readonly ({
    product_id: number,
    language_id: number,
    name: string,
    description: string | null | void
  })[];
}

/** 'ProductDescriptionUpsertQuery' return type */
export type IProductDescriptionUpsertQueryResult = void;

/** 'ProductDescriptionUpsertQuery' query type */
export interface IProductDescriptionUpsertQueryQuery {
  params: IProductDescriptionUpsertQueryParams;
  result: IProductDescriptionUpsertQueryResult;
}

/** 'ProductCreateQuery' parameters type */
export interface IProductCreateQueryParams {
  categoryId: number;
  images: Json;
  slug: string;
}

/** 'ProductCreateQuery' return type */
export interface IProductCreateQueryResult {
  id: number;
}

/** 'ProductCreateQuery' query type */
export interface IProductCreateQueryQuery {
  params: IProductCreateQueryParams;
  result: IProductCreateQueryResult;
}

