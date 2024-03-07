/** Types generated for queries found in "src/option-group.ts" */
export type option_type = 'color' | 'size' | 'text';

/** 'OptionGroupCreateQuery' parameters type */
export interface IOptionGroupCreateQueryParams {
  sort_order: number;
  type: option_type;
}

/** 'OptionGroupCreateQuery' return type */
export interface IOptionGroupCreateQueryResult {
  id: number;
}

/** 'OptionGroupCreateQuery' query type */
export interface IOptionGroupCreateQueryQuery {
  params: IOptionGroupCreateQueryParams;
  result: IOptionGroupCreateQueryResult;
}

/** 'OptionGroupFindOneQuery' parameters type */
export interface IOptionGroupFindOneQueryParams {
  id?: number | null | void;
}

/** 'OptionGroupFindOneQuery' return type */
export interface IOptionGroupFindOneQueryResult {
  id: number;
  sort_order: number;
  type: option_type;
}

/** 'OptionGroupFindOneQuery' query type */
export interface IOptionGroupFindOneQueryQuery {
  params: IOptionGroupFindOneQueryParams;
  result: IOptionGroupFindOneQueryResult;
}

/** 'OptionGroupDescriptionListQuery' parameters type */
export interface IOptionGroupDescriptionListQueryParams {
  option_group_id: number;
}

/** 'OptionGroupDescriptionListQuery' return type */
export interface IOptionGroupDescriptionListQueryResult {
  description: string | null;
  language_id: number;
  name: string;
  option_group_id: number;
}

/** 'OptionGroupDescriptionListQuery' query type */
export interface IOptionGroupDescriptionListQueryQuery {
  params: IOptionGroupDescriptionListQueryParams;
  result: IOptionGroupDescriptionListQueryResult;
}

/** 'OptionGroupUpdateQuery' parameters type */
export interface IOptionGroupUpdateQueryParams {
  id: number;
  sort_order?: number | null | void;
  type?: option_type | null | void;
}

/** 'OptionGroupUpdateQuery' return type */
export interface IOptionGroupUpdateQueryResult {
  id: number;
}

/** 'OptionGroupUpdateQuery' query type */
export interface IOptionGroupUpdateQueryQuery {
  params: IOptionGroupUpdateQueryParams;
  result: IOptionGroupUpdateQueryResult;
}

/** 'OptionGroupDescriptionUpsertQuery' parameters type */
export interface IOptionGroupDescriptionUpsertQueryParams {
  values: readonly ({
    option_group_id: number,
    language_id: number,
    name: string,
    description: string | null | void
  })[];
}

/** 'OptionGroupDescriptionUpsertQuery' return type */
export interface IOptionGroupDescriptionUpsertQueryResult {
  description: string | null;
  language_id: number;
  name: string;
  option_group_id: number;
}

/** 'OptionGroupDescriptionUpsertQuery' query type */
export interface IOptionGroupDescriptionUpsertQueryQuery {
  params: IOptionGroupDescriptionUpsertQueryParams;
  result: IOptionGroupDescriptionUpsertQueryResult;
}

