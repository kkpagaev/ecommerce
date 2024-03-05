/** Types generated for queries found in "src/queries.ts" */
export type NumberOrString = number | string;

/** 'AttributeListCountQuery' parameters type */
export type IAttributeListCountQueryParams = void;

/** 'AttributeListCountQuery' return type */
export interface IAttributeListCountQueryResult {
  count: string | null;
}

/** 'AttributeListCountQuery' query type */
export interface IAttributeListCountQueryQuery {
  params: IAttributeListCountQueryParams;
  result: IAttributeListCountQueryResult;
}

/** Query 'AttributeListQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IAttributeListQueryResult = never;

/** Query 'AttributeListQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IAttributeListQueryParams = never;

/** 'AttributeDeleteQuery' parameters type */
export interface IAttributeDeleteQueryParams {
  id: number;
}

/** 'AttributeDeleteQuery' return type */
export type IAttributeDeleteQueryResult = void;

/** 'AttributeDeleteQuery' query type */
export interface IAttributeDeleteQueryQuery {
  params: IAttributeDeleteQueryParams;
  result: IAttributeDeleteQueryResult;
}

/** Query 'AttributeValueIdListQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IAttributeValueIdListQueryResult = never;

/** Query 'AttributeValueIdListQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IAttributeValueIdListQueryParams = never;

/** Query 'AttributeValueCreateQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IAttributeValueCreateQueryResult = never;

/** Query 'AttributeValueCreateQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IAttributeValueCreateQueryParams = never;

/** Query 'AttributeValueUpdateQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IAttributeValueUpdateQueryResult = never;

/** Query 'AttributeValueUpdateQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IAttributeValueUpdateQueryParams = never;

/** Query 'AttributeValueDeleteQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IAttributeValueDeleteQueryResult = never;

/** Query 'AttributeValueDeleteQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IAttributeValueDeleteQueryParams = never;

/** Query 'AttributeValueDeleteManyQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IAttributeValueDeleteManyQueryResult = never;

/** Query 'AttributeValueDeleteManyQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IAttributeValueDeleteManyQueryParams = never;

/** 'ProductListQuery' parameters type */
export interface IProductListQueryParams {
  limit?: number | null | void;
  page?: number | null | void;
}

/** 'ProductListQuery' return type */
export interface IProductListQueryResult {
  categoryId: number;
  createdAt: Date;
  id: number;
  slug: string;
  updatedAt: Date;
}

/** 'ProductListQuery' query type */
export interface IProductListQueryQuery {
  params: IProductListQueryParams;
  result: IProductListQueryResult;
}

/** 'ProductFindOneQuery' parameters type */
export interface IProductFindOneQueryParams {
  id?: number | null | void;
}

/** 'ProductFindOneQuery' return type */
export interface IProductFindOneQueryResult {
  categoryId: number;
  createdAt: Date;
  id: number;
  slug: string;
  updatedAt: Date;
}

/** 'ProductFindOneQuery' query type */
export interface IProductFindOneQueryQuery {
  params: IProductFindOneQueryParams;
  result: IProductFindOneQueryResult;
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

/** Query 'ProductCreateQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IProductCreateQueryResult = never;

/** Query 'ProductCreateQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IProductCreateQueryParams = never;

/** Query 'ProductUpdateQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IProductUpdateQueryResult = never;

/** Query 'ProductUpdateQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IProductUpdateQueryParams = never;

/** Query 'ProductAttributeValueListQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IProductAttributeValueListQueryResult = never;

/** Query 'ProductAttributeValueListQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IProductAttributeValueListQueryParams = never;

/** 'ProductAttributeValueDeleteQuery' parameters type */
export interface IProductAttributeValueDeleteQueryParams {
  product_id?: number | null | void;
}

/** 'ProductAttributeValueDeleteQuery' return type */
export type IProductAttributeValueDeleteQueryResult = void;

/** 'ProductAttributeValueDeleteQuery' query type */
export interface IProductAttributeValueDeleteQueryQuery {
  params: IProductAttributeValueDeleteQueryParams;
  result: IProductAttributeValueDeleteQueryResult;
}

/** Query 'ProductAttributeVAlueInsertQuery' is invalid, so its result is assigned type 'never'.
 *  */
export type IProductAttributeVAlueInsertQueryResult = never;

/** Query 'ProductAttributeVAlueInsertQuery' is invalid, so its parameters are assigned type 'never'.
 *  */
export type IProductAttributeVAlueInsertQueryParams = never;

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

/** 'ProductFindByIdQuery' parameters type */
export interface IProductFindByIdQueryParams {
  id?: number | null | void;
}

/** 'ProductFindByIdQuery' return type */
export interface IProductFindByIdQueryResult {
  categoryId: number;
  createdAt: Date;
  id: number;
  slug: string;
  updatedAt: Date;
}

/** 'ProductFindByIdQuery' query type */
export interface IProductFindByIdQueryQuery {
  params: IProductFindByIdQueryParams;
  result: IProductFindByIdQueryResult;
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

