/** Types generated for queries found in "src/option.js" */
export type option_type = 'color' | 'size' | 'text';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'OptionFindManyQuery' parameters type */
export interface IOptionFindManyQueryParams {
  groupId?: number | null | void;
  languageId: number;
}

/** 'OptionFindManyQuery' return type */
export interface IOptionFindManyQueryResult {
  id: number;
  name: string;
  option_group_id: number;
  type: option_type;
  value: Json;
}

/** 'OptionFindManyQuery' query type */
export interface IOptionFindManyQueryQuery {
  params: IOptionFindManyQueryParams;
  result: IOptionFindManyQueryResult;
}

/** 'OptionCountQuery' parameters type */
export interface IOptionCountQueryParams {
  groupId?: number | null | void;
}

/** 'OptionCountQuery' return type */
export interface IOptionCountQueryResult {
  count: string | null;
}

/** 'OptionCountQuery' query type */
export interface IOptionCountQueryQuery {
  params: IOptionCountQueryParams;
  result: IOptionCountQueryResult;
}

/** 'OptionCreateQuery' parameters type */
export interface IOptionCreateQueryParams {
  groupId: number;
  value: Json;
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

/** 'OptionFindOneQuery' parameters type */
export interface IOptionFindOneQueryParams {
  id: number;
}

/** 'OptionFindOneQuery' return type */
export interface IOptionFindOneQueryResult {
  id: number;
  option_group_id: number;
  type: option_type;
  value: Json;
}

/** 'OptionFindOneQuery' query type */
export interface IOptionFindOneQueryQuery {
  params: IOptionFindOneQueryParams;
  result: IOptionFindOneQueryResult;
}

/** 'OptionDescriptionUpsertQuery' parameters type */
export interface IOptionDescriptionUpsertQueryParams {
  values: readonly ({
    optionId: number,
    languageId: number,
    name: string
  })[];
}

/** 'OptionDescriptionUpsertQuery' return type */
export interface IOptionDescriptionUpsertQueryResult {
  option_id: number;
}

/** 'OptionDescriptionUpsertQuery' query type */
export interface IOptionDescriptionUpsertQueryQuery {
  params: IOptionDescriptionUpsertQueryParams;
  result: IOptionDescriptionUpsertQueryResult;
}

/** 'OptionUpdateQuery' parameters type */
export interface IOptionUpdateQueryParams {
  id: number;
  value?: Json | null | void;
}

/** 'OptionUpdateQuery' return type */
export interface IOptionUpdateQueryResult {
  id: number;
}

/** 'OptionUpdateQuery' query type */
export interface IOptionUpdateQueryQuery {
  params: IOptionUpdateQueryParams;
  result: IOptionUpdateQueryResult;
}

/** 'OptionDeleteQuery' parameters type */
export interface IOptionDeleteQueryParams {
  id: number;
}

/** 'OptionDeleteQuery' return type */
export type IOptionDeleteQueryResult = void;

/** 'OptionDeleteQuery' query type */
export interface IOptionDeleteQueryQuery {
  params: IOptionDeleteQueryParams;
  result: IOptionDeleteQueryResult;
}

