/** Types generated for queries found in "src/product-filtering.js" */

/** 'GetOptionsQuery' parameters type */
export interface IGetOptionsQueryParams {
  categoryId?: number | null | void;
  languageId?: number | null | void;
}

/** 'GetOptionsQuery' return type */
export interface IGetOptionsQueryResult {
  id: number;
  name: string;
  option_group_id: number;
  option_group_name: string;
}

/** 'GetOptionsQuery' query type */
export interface IGetOptionsQueryQuery {
  params: IGetOptionsQueryParams;
  result: IGetOptionsQueryResult;
}

/** 'GetAttributes' parameters type */
export interface IGetAttributesParams {
  categoryId?: number | null | void;
  languageId?: number | null | void;
}

/** 'GetAttributes' return type */
export interface IGetAttributesResult {
  attribute_group_id: number;
  group_name: string;
  id: number;
  name: string;
}

/** 'GetAttributes' query type */
export interface IGetAttributesQuery {
  params: IGetAttributesParams;
  result: IGetAttributesResult;
}

