/** Types generated for queries found in "src/core/catalog/queries.ts" */
export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'AttributeFindByIdQuery' parameters type */
export interface IAttributeFindByIdQueryParams {
  id: number;
}

/** 'AttributeFindByIdQuery' return type */
export interface IAttributeFindByIdQueryResult {
  description: Json | null;
  id: number;
  name: Json;
}

/** 'AttributeFindByIdQuery' query type */
export interface IAttributeFindByIdQueryQuery {
  params: IAttributeFindByIdQueryParams;
  result: IAttributeFindByIdQueryResult;
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
  description: Json | null;
  id: number;
  name: Json;
}

/** 'AttributeListQuery' query type */
export interface IAttributeListQueryQuery {
  params: IAttributeListQueryParams;
  result: IAttributeListQueryResult;
}

/** 'AttributeCreateQuery' parameters type */
export interface IAttributeCreateQueryParams {
  description?: Json | null | void;
  name: Json;
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
  description?: Json | null | void;
  id: number;
  name?: Json | null | void;
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

/** 'AttributeValuesListQuery' parameters type */
export interface IAttributeValuesListQueryParams {
  attribute_id?: number | null | void;
}

/** 'AttributeValuesListQuery' return type */
export interface IAttributeValuesListQueryResult {
  attribute_id: number | null;
  id: number;
  value: Json;
}

/** 'AttributeValuesListQuery' query type */
export interface IAttributeValuesListQueryQuery {
  params: IAttributeValuesListQueryParams;
  result: IAttributeValuesListQueryResult;
}

/** 'AttributeValuesCreateQuery' parameters type */
export interface IAttributeValuesCreateQueryParams {
  values: readonly ({
    attributeId: number | null | void,
    value: Json | null | void
  })[];
}

/** 'AttributeValuesCreateQuery' return type */
export type IAttributeValuesCreateQueryResult = void;

/** 'AttributeValuesCreateQuery' query type */
export interface IAttributeValuesCreateQueryQuery {
  params: IAttributeValuesCreateQueryParams;
  result: IAttributeValuesCreateQueryResult;
}

/** 'AttributeValuesUpdateQuery' parameters type */
export interface IAttributeValuesUpdateQueryParams {
  id: number;
  value?: Json | null | void;
}

/** 'AttributeValuesUpdateQuery' return type */
export type IAttributeValuesUpdateQueryResult = void;

/** 'AttributeValuesUpdateQuery' query type */
export interface IAttributeValuesUpdateQueryQuery {
  params: IAttributeValuesUpdateQueryParams;
  result: IAttributeValuesUpdateQueryResult;
}

/** 'AttributeValuesDeleteQuery' parameters type */
export interface IAttributeValuesDeleteQueryParams {
  id: number;
}

/** 'AttributeValuesDeleteQuery' return type */
export type IAttributeValuesDeleteQueryResult = void;

/** 'AttributeValuesDeleteQuery' query type */
export interface IAttributeValuesDeleteQueryQuery {
  params: IAttributeValuesDeleteQueryParams;
  result: IAttributeValuesDeleteQueryResult;
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
  description: Json | null;
  id: number;
  name: Json | null;
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
  description: Json | null;
  id: number;
  name: Json | null;
  slug: string;
}

/** 'CategoryFindByIdQuery' query type */
export interface ICategoryFindByIdQueryQuery {
  params: ICategoryFindByIdQueryParams;
  result: ICategoryFindByIdQueryResult;
}

/** 'CategoryCreateQuery' parameters type */
export interface ICategoryCreateQueryParams {
  description?: Json | null | void;
  name: Json;
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
  description?: Json | null | void;
  id: number;
  name?: Json | null | void;
  slug?: string | null | void;
}

/** 'CategoryUpdateQuery' return type */
export type ICategoryUpdateQueryResult = void;

/** 'CategoryUpdateQuery' query type */
export interface ICategoryUpdateQueryQuery {
  params: ICategoryUpdateQueryParams;
  result: ICategoryUpdateQueryResult;
}

/** 'OptionCreateQuery' parameters type */
export interface IOptionCreateQueryParams {
  name: Json;
}

/** 'OptionCreateQuery' return type */
export interface IOptionCreateQueryResult {
  id: number;
}

/** 'OptionCreateQuery' query type */
export interface IOptionCreateQueryQuery {
  params: IOptionCreateQueryParams;
  result: IOptionCreateQueryResult;
}

/** 'OptionUpdateQuery' parameters type */
export interface IOptionUpdateQueryParams {
  id: number;
  name?: Json | null | void;
}

/** 'OptionUpdateQuery' return type */
export type IOptionUpdateQueryResult = void;

/** 'OptionUpdateQuery' query type */
export interface IOptionUpdateQueryQuery {
  params: IOptionUpdateQueryParams;
  result: IOptionUpdateQueryResult;
}

/** 'OptionDeleteQuery' parameters type */
export interface IOptionDeleteQueryParams {
  id?: number | null | void;
}

/** 'OptionDeleteQuery' return type */
export type IOptionDeleteQueryResult = void;

/** 'OptionDeleteQuery' query type */
export interface IOptionDeleteQueryQuery {
  params: IOptionDeleteQueryParams;
  result: IOptionDeleteQueryResult;
}

/** 'OptionFindByIdQuery' parameters type */
export interface IOptionFindByIdQueryParams {
  id?: number | null | void;
}

/** 'OptionFindByIdQuery' return type */
export interface IOptionFindByIdQueryResult {
  id: number;
  name: Json;
}

/** 'OptionFindByIdQuery' query type */
export interface IOptionFindByIdQueryQuery {
  params: IOptionFindByIdQueryParams;
  result: IOptionFindByIdQueryResult;
}

