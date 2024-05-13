/** Types generated for queries found in "src/product.js" */
export type NumberOrString = number | string;

export type numberArray = (number)[];

/** 'ProductListQuery' parameters type */
export interface IProductListQueryParams {
  language_id: number;
}

/** 'ProductListQuery' return type */
export interface IProductListQueryResult {
  category_id: number;
  description: string | null;
  id: number;
  images: string | string[] | Record<string, any> | null;
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

/** 'ProductOptionGroupsListQuery' parameters type */
export interface IProductOptionGroupsListQueryParams {
  product_id: number;
}

/** 'ProductOptionGroupsListQuery' return type */
export interface IProductOptionGroupsListQueryResult {
  id: number;
}

/** 'ProductOptionGroupsListQuery' query type */
export interface IProductOptionGroupsListQueryQuery {
  params: IProductOptionGroupsListQueryParams;
  result: IProductOptionGroupsListQueryResult;
}

/** 'ProductOptionsListQuery' parameters type */
export interface IProductOptionsListQueryParams {
  product_id: number;
}

/** 'ProductOptionsListQuery' return type */
export interface IProductOptionsListQueryResult {
  id: number;
}

/** 'ProductOptionsListQuery' query type */
export interface IProductOptionsListQueryQuery {
  params: IProductOptionsListQueryParams;
  result: IProductOptionsListQueryResult;
}

/** 'ProductUpdateQuery' parameters type */
export interface IProductUpdateQueryParams {
  categoryId?: number | null | void;
  id: number;
  images?: string | string[] | Record<string, any> | null | void;
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
  images: string | string[] | Record<string, any> | null;
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

/** 'ProductAttributesDeleteQuery' parameters type */
export interface IProductAttributesDeleteQueryParams {
  product_id: number;
}

/** 'ProductAttributesDeleteQuery' return type */
export type IProductAttributesDeleteQueryResult = void;

/** 'ProductAttributesDeleteQuery' query type */
export interface IProductAttributesDeleteQueryQuery {
  params: IProductAttributesDeleteQueryParams;
  result: IProductAttributesDeleteQueryResult;
}

/** 'ProductOptionGroupsDeleteQuery' parameters type */
export interface IProductOptionGroupsDeleteQueryParams {
  product_id: number;
}

/** 'ProductOptionGroupsDeleteQuery' return type */
export type IProductOptionGroupsDeleteQueryResult = void;

/** 'ProductOptionGroupsDeleteQuery' query type */
export interface IProductOptionGroupsDeleteQueryQuery {
  params: IProductOptionGroupsDeleteQueryParams;
  result: IProductOptionGroupsDeleteQueryResult;
}

/** 'ProductOptionGroupsUpsertQuery' parameters type */
export interface IProductOptionGroupsUpsertQueryParams {
  values: readonly ({
    product_id: number,
    option_group_id: number
  })[];
}

/** 'ProductOptionGroupsUpsertQuery' return type */
export type IProductOptionGroupsUpsertQueryResult = void;

/** 'ProductOptionGroupsUpsertQuery' query type */
export interface IProductOptionGroupsUpsertQueryQuery {
  params: IProductOptionGroupsUpsertQueryParams;
  result: IProductOptionGroupsUpsertQueryResult;
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

/** 'ProductOptionsDeleteQuery' parameters type */
export interface IProductOptionsDeleteQueryParams {
  product_id: number;
}

/** 'ProductOptionsDeleteQuery' return type */
export type IProductOptionsDeleteQueryResult = void;

/** 'ProductOptionsDeleteQuery' query type */
export interface IProductOptionsDeleteQueryQuery {
  params: IProductOptionsDeleteQueryParams;
  result: IProductOptionsDeleteQueryResult;
}

/** 'ProductOptionsUpsertQuery' parameters type */
export interface IProductOptionsUpsertQueryParams {
  values: readonly ({
    product_id: number,
    option_id: number
  })[];
}

/** 'ProductOptionsUpsertQuery' return type */
export type IProductOptionsUpsertQueryResult = void;

/** 'ProductOptionsUpsertQuery' query type */
export interface IProductOptionsUpsertQueryQuery {
  params: IProductOptionsUpsertQueryParams;
  result: IProductOptionsUpsertQueryResult;
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

/** 'ProductPaginateQuery' parameters type */
export interface IProductPaginateQueryParams {
  attributes?: numberArray | null | void;
  categoryId?: number | null | void;
  language_id: number;
  limit?: number | null | void;
  offset?: number | null | void;
  options?: numberArray | null | void;
}

/** 'ProductPaginateQuery' return type */
export interface IProductPaginateQueryResult {
  id: number;
  images: string | string[] | Record<string, any> | null;
  name: string;
  price: string | null;
  slug: string;
}

/** 'ProductPaginateQuery' query type */
export interface IProductPaginateQueryQuery {
  params: IProductPaginateQueryParams;
  result: IProductPaginateQueryResult;
}

/** 'ProductCreateQuery' parameters type */
export interface IProductCreateQueryParams {
  categoryId: number;
  images: string | string[] | Record<string, any>;
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

