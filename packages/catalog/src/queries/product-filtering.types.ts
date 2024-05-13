/** Types generated for queries found in "src/product-filtering.js" */

/** 'GetAttributes' parameters type */
export interface IGetAttributesParams {
  categoryId?: number | null | void;
}

/** 'GetAttributes' return type */
export interface IGetAttributesResult {
  attribute_id: number;
  attribute_name: string;
  group_id: number;
  group_name: string;
}

/** 'GetAttributes' query type */
export interface IGetAttributesQuery {
  params: IGetAttributesParams;
  result: IGetAttributesResult;
}
