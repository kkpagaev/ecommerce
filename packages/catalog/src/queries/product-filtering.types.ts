/** Types generated for queries found in "src/product-filtering.js" */
export type numberArray = (number)[];

/** 'GetOptionsQuery' parameters type */
export interface IGetOptionsQueryParams {
  attributes?: numberArray | null | void;
}

/** 'GetOptionsQuery' return type */
export interface IGetOptionsQueryResult {
  group_id: number;
  group_name: string;
  option_id: number;
  option_name: string;
  product_count: string | null;
}

/** 'GetOptionsQuery' query type */
export interface IGetOptionsQueryQuery {
  params: IGetOptionsQueryParams;
  result: IGetOptionsQueryResult;
}

/** 'GetAttributes' parameters type */
export interface IGetAttributesParams {
  options?: numberArray | null | void;
}

/** 'GetAttributes' return type */
export interface IGetAttributesResult {
  attribute_id: number;
  attribute_name: string;
  group_id: number;
  group_name: string;
  product_count: string | null;
}

/** 'GetAttributes' query type */
export interface IGetAttributesQuery {
  params: IGetAttributesParams;
  result: IGetAttributesResult;
}

