/** Types generated for queries found in "src/core/catalog/queries.ts" */
import type { Translation } from "./i18n";

export type NumberOrString = number | string;

/** 'AttributeFindByIdQuery' parameters type */
export interface IAttributeFindByIdQueryParams {
  id: number;
}

/** 'AttributeFindByIdQuery' return type */
export interface IAttributeFindByIdQueryResult {
  description: Translation | null;
  id: number;
  name: Translation;
}

/** 'AttributeFindByIdQuery' query type */
export interface IAttributeFindByIdQueryQuery {
  params: IAttributeFindByIdQueryParams;
  result: IAttributeFindByIdQueryResult;
}

/** 'AttributeFindOneQuery' parameters type */
export interface IAttributeFindOneQueryParams {
  id?: number | null | void;
}

/** 'AttributeFindOneQuery' return type */
export interface IAttributeFindOneQueryResult {
  description: Translation | null;
  id: number;
  name: Translation;
}

/** 'AttributeFindOneQuery' query type */
export interface IAttributeFindOneQueryQuery {
  params: IAttributeFindOneQueryParams;
  result: IAttributeFindOneQueryResult;
}

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

/** 'AttributeListQuery' parameters type */
export interface IAttributeListQueryParams {
  limit?: number | null | void;
  page?: number | null | void;
}

/** 'AttributeListQuery' return type */
export interface IAttributeListQueryResult {
  description: Translation | null;
  id: number;
  name: Translation;
}

/** 'AttributeListQuery' query type */
export interface IAttributeListQueryQuery {
  params: IAttributeListQueryParams;
  result: IAttributeListQueryResult;
}

/** 'AttributeCreateQuery' parameters type */
export interface IAttributeCreateQueryParams {
  values: readonly ({
    name: Translation;
    description: Translation | null | void;
  })[];
}

/** 'AttributeCreateQuery' return type */
export interface IAttributeCreateQueryResult {
  id: number;
}

/** 'AttributeCreateQuery' query type */
export interface IAttributeCreateQueryQuery {
  params: IAttributeCreateQueryParams;
  result: IAttributeCreateQueryResult;
}

/** 'AttributeUpdateQuery' parameters type */
export interface IAttributeUpdateQueryParams {
  description?: Translation | null | void;
  id: number;
  name?: Translation | null | void;
}

/** 'AttributeUpdateQuery' return type */
export type IAttributeUpdateQueryResult = void;

/** 'AttributeUpdateQuery' query type */
export interface IAttributeUpdateQueryQuery {
  params: IAttributeUpdateQueryParams;
  result: IAttributeUpdateQueryResult;
}

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

/** 'AttributeValueListQuery' parameters type */
export interface IAttributeValueListQueryParams {
  attribute_id?: number | null | void;
}

/** 'AttributeValueListQuery' return type */
export interface IAttributeValueListQueryResult {
  attribute_id: number | null;
  id: number;
  value: Translation;
}

/** 'AttributeValueListQuery' query type */
export interface IAttributeValueListQueryQuery {
  params: IAttributeValueListQueryParams;
  result: IAttributeValueListQueryResult;
}

/** 'AttributeValueIdListQuery' parameters type */
export interface IAttributeValueIdListQueryParams {
  attributeId: number;
}

/** 'AttributeValueIdListQuery' return type */
export interface IAttributeValueIdListQueryResult {
  id: number;
}

/** 'AttributeValueIdListQuery' query type */
export interface IAttributeValueIdListQueryQuery {
  params: IAttributeValueIdListQueryParams;
  result: IAttributeValueIdListQueryResult;
}

/** 'AttributeValueCreateQuery' parameters type */
export interface IAttributeValueCreateQueryParams {
  values: readonly ({
    attributeId: number | null | void;
    value: Translation | null | void;
  })[];
}

/** 'AttributeValueCreateQuery' return type */
export interface IAttributeValueCreateQueryResult {
  id: number;
}

/** 'AttributeValueCreateQuery' query type */
export interface IAttributeValueCreateQueryQuery {
  params: IAttributeValueCreateQueryParams;
  result: IAttributeValueCreateQueryResult;
}

/** 'AttributeValueUpdateQuery' parameters type */
export interface IAttributeValueUpdateQueryParams {
  id: number;
  value?: Translation | null | void;
}

/** 'AttributeValueUpdateQuery' return type */
export type IAttributeValueUpdateQueryResult = void;

/** 'AttributeValueUpdateQuery' query type */
export interface IAttributeValueUpdateQueryQuery {
  params: IAttributeValueUpdateQueryParams;
  result: IAttributeValueUpdateQueryResult;
}

/** 'AttributeValueDeleteQuery' parameters type */
export interface IAttributeValueDeleteQueryParams {
  id: number;
}

/** 'AttributeValueDeleteQuery' return type */
export type IAttributeValueDeleteQueryResult = void;

/** 'AttributeValueDeleteQuery' query type */
export interface IAttributeValueDeleteQueryQuery {
  params: IAttributeValueDeleteQueryParams;
  result: IAttributeValueDeleteQueryResult;
}

/** 'AttributeValueDeleteManyQuery' parameters type */
export interface IAttributeValueDeleteManyQueryParams {
  ids: readonly (number | null | void)[];
}

/** 'AttributeValueDeleteManyQuery' return type */
export type IAttributeValueDeleteManyQueryResult = void;

/** 'AttributeValueDeleteManyQuery' query type */
export interface IAttributeValueDeleteManyQueryQuery {
  params: IAttributeValueDeleteManyQueryParams;
  result: IAttributeValueDeleteManyQueryResult;
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

/** 'CategoryListQuery' parameters type */
export interface ICategoryListQueryParams {
  limit?: number | null | void;
  page?: number | null | void;
}

/** 'CategoryListQuery' return type */
export interface ICategoryListQueryResult {
  description: Translation | null;
  id: number;
  name: Translation | null;
  slug: string;
}

/** 'CategoryListQuery' query type */
export interface ICategoryListQueryQuery {
  params: ICategoryListQueryParams;
  result: ICategoryListQueryResult;
}

/** 'CategoryFindByIdQuery' parameters type */
export interface ICategoryFindByIdQueryParams {
  id?: number | null | void;
}

/** 'CategoryFindByIdQuery' return type */
export interface ICategoryFindByIdQueryResult {
  description: Translation | null;
  id: number;
  name: Translation | null;
  slug: string;
}

/** 'CategoryFindByIdQuery' query type */
export interface ICategoryFindByIdQueryQuery {
  params: ICategoryFindByIdQueryParams;
  result: ICategoryFindByIdQueryResult;
}

/** 'CategoryCreateQuery' parameters type */
export interface ICategoryCreateQueryParams {
  description?: Translation | null | void;
  name: Translation;
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

/** 'CategoryUpdateQuery' parameters type */
export interface ICategoryUpdateQueryParams {
  description?: Translation | null | void;
  id: number;
  name?: Translation | null | void;
  slug?: string | null | void;
}

/** 'CategoryUpdateQuery' return type */
export type ICategoryUpdateQueryResult = void;

/** 'CategoryUpdateQuery' query type */
export interface ICategoryUpdateQueryQuery {
  params: ICategoryUpdateQueryParams;
  result: ICategoryUpdateQueryResult;
}

/** 'ProductListQuery' parameters type */
export interface IProductListQueryParams {
  limit?: number | null | void;
  page?: number | null | void;
}

/** 'ProductListQuery' return type */
export interface IProductListQueryResult {
  category_id: number | null;
  created_at: Date;
  description: Translation | null;
  id: number;
  name: Translation;
  slug: string;
  updated_at: Date;
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
  category_id: number | null;
  created_at: Date;
  description: Translation | null;
  id: number;
  name: Translation;
  slug: string;
  updated_at: Date;
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

/** 'ProductCreateQuery' parameters type */
export interface IProductCreateQueryParams {
  categoryId: number;
  description?: Translation | null | void;
  name: Translation;
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

/** 'ProductUpdateQuery' parameters type */
export interface IProductUpdateQueryParams {
  categoryId?: number | null | void;
  description?: Translation | null | void;
  id: number;
  name?: Translation | null | void;
  slug?: string | null | void;
}

/** 'ProductUpdateQuery' return type */
export type IProductUpdateQueryResult = void;

/** 'ProductUpdateQuery' query type */
export interface IProductUpdateQueryQuery {
  params: IProductUpdateQueryParams;
  result: IProductUpdateQueryResult;
}

/** 'ProductAttributeValueListQuery' parameters type */
export interface IProductAttributeValueListQueryParams {
  productId?: number | null | void;
}

/** 'ProductAttributeValueListQuery' return type */
export interface IProductAttributeValueListQueryResult {
  attribute_id: number | null;
  attribute_name: Translation;
  id: number;
  value: Translation;
}

/** 'ProductAttributeValueListQuery' query type */
export interface IProductAttributeValueListQueryQuery {
  params: IProductAttributeValueListQueryParams;
  result: IProductAttributeValueListQueryResult;
}

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

/** 'ProductAttributeVAlueInsertQuery' parameters type */
export interface IProductAttributeVAlueInsertQueryParams {
  values: readonly ({
    productId: number;
    attributeValueId: number;
  })[];
}

/** 'ProductAttributeVAlueInsertQuery' return type */
export type IProductAttributeVAlueInsertQueryResult = void;

/** 'ProductAttributeVAlueInsertQuery' query type */
export interface IProductAttributeVAlueInsertQueryQuery {
  params: IProductAttributeVAlueInsertQueryParams;
  result: IProductAttributeVAlueInsertQueryResult;
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

/** 'ProductFindByIdQuery' parameters type */
export interface IProductFindByIdQueryParams {
  id?: number | null | void;
}

/** 'ProductFindByIdQuery' return type */
export interface IProductFindByIdQueryResult {
  category_id: number | null;
  created_at: Date;
  description: Translation | null;
  id: number;
  name: Translation;
  slug: string;
  updated_at: Date;
}

/** 'ProductFindByIdQuery' query type */
export interface IProductFindByIdQueryQuery {
  params: IProductFindByIdQueryParams;
  result: IProductFindByIdQueryResult;
}

/** 'PriceUpsertQuery' parameters type */
export interface IPriceUpsertQueryParams {
  values: readonly ({
    product_id: NumberOrString;
    price: NumberOrString;
    type: string | null | void;
  })[];
}

/** 'PriceUpsertQuery' return type */
export type IPriceUpsertQueryResult = void;

/** 'PriceUpsertQuery' query type */
export interface IPriceUpsertQueryQuery {
  params: IPriceUpsertQueryParams;
  result: IPriceUpsertQueryResult;
}