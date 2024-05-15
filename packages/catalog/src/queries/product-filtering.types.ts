/** Types generated for queries found in "src/product-filtering.js" */
export type product_variant_stock_status = 'in_stock' | 'out_of_stock' | 'preorder';

export type numberArray = (number)[];

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

/** 'ProductVariantPaginateQuery' parameters type */
export interface IProductVariantPaginateQueryParams {
  attributes?: numberArray | null | void;
  categoryId?: number | null | void;
  languageId?: number | null | void;
  limit?: number | null | void;
  offset?: number | null | void;
  options?: numberArray | null | void;
}

/** 'ProductVariantPaginateQuery' return type */
export interface IProductVariantPaginateQueryResult {
  id: number;
  images: string | string[] | Record<string, any>;
  name: string;
  old_price: number;
  price: number;
  stock_status: product_variant_stock_status;
}

/** 'ProductVariantPaginateQuery' query type */
export interface IProductVariantPaginateQueryQuery {
  params: IProductVariantPaginateQueryParams;
  result: IProductVariantPaginateQueryResult;
}

