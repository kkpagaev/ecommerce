/** Types generated for queries found in "src/product-variants.js" */
export type product_variant_stock_status =
  | "in_stock"
  | "out_of_stock"
  | "preorder";

/** 'ProductVariantsListQuery' parameters type */
export interface IProductVariantsListQueryParams {
  product_id: number;
}

/** 'ProductVariantsListQuery' return type */
export interface IProductVariantsListQueryResult {
  id: number;
  product_id: number;
}

/** 'ProductVariantsListQuery' query type */
export interface IProductVariantsListQueryQuery {
  params: IProductVariantsListQueryParams;
  result: IProductVariantsListQueryResult;
}

/** 'ProductVariantCreateQuery' parameters type */
export interface IProductVariantCreateQueryParams {
  article: string;
  barcode: string;
  discount: number;
  images: string | string[] | Record<string, any>;
  is_active: boolean;
  old_price: number;
  popularity: number;
  price: number;
  product_id: number;
  slug: string;
  stock_status: product_variant_stock_status;
}

/** 'ProductVariantCreateQuery' return type */
export interface IProductVariantCreateQueryResult {
  article: string;
  barcode: string;
  created_at: Date | null;
  discount: number;
  id: number;
  images: string | string[] | Record<string, any>;
  is_active: boolean;
  old_price: number;
  popularity: number;
  price: number;
  product_id: number;
  slug: string;
  stock_status: product_variant_stock_status;
}

/** 'ProductVariantCreateQuery' query type */
export interface IProductVariantCreateQueryQuery {
  params: IProductVariantCreateQueryParams;
  result: IProductVariantCreateQueryResult;
}

/** 'ProductVariantDescriptionsUpsertQuery' parameters type */
export interface IProductVariantDescriptionsUpsertQueryParams {
  values: readonly {
    product_variant_id: number;
    language_id: number;
    name: string;
    short_description: string | null | void;
  }[];
}

/** 'ProductVariantDescriptionsUpsertQuery' return type */
export type IProductVariantDescriptionsUpsertQueryResult = void;

/** 'ProductVariantDescriptionsUpsertQuery' query type */
export interface IProductVariantDescriptionsUpsertQueryQuery {
  params: IProductVariantDescriptionsUpsertQueryParams;
  result: IProductVariantDescriptionsUpsertQueryResult;
}

/** 'ProductVariantUpdateQuery' parameters type */
export interface IProductVariantUpdateQueryParams {
  article?: string | null | void;
  barcode?: string | null | void;
  discount?: number | null | void;
  id: number;
  images?: string | string[] | Record<string, any> | null | void;
  is_active?: boolean | null | void;
  old_price?: number | null | void;
  popularity?: number | null | void;
  price?: number | null | void;
  slug?: string | null | void;
  stock_status?: product_variant_stock_status | null | void;
}

/** 'ProductVariantUpdateQuery' return type */
export interface IProductVariantUpdateQueryResult {
  article: string;
  barcode: string;
  created_at: Date | null;
  discount: number;
  id: number;
  images: string | string[] | Record<string, any>;
  is_active: boolean;
  old_price: number;
  popularity: number;
  price: number;
  product_id: number;
  slug: string;
  stock_status: product_variant_stock_status;
}

/** 'ProductVariantUpdateQuery' query type */
export interface IProductVariantUpdateQueryQuery {
  params: IProductVariantUpdateQueryParams;
  result: IProductVariantUpdateQueryResult;
}

/** 'ProductVariantsOptionsListOptionsQuery' parameters type */
export interface IProductVariantsOptionsListOptionsQueryParams {
  language_id: number;
  product_variant_ids: readonly number[];
}

/** 'ProductVariantsOptionsListOptionsQuery' return type */
export interface IProductVariantsOptionsListOptionsQueryResult {
  name: string;
  option_group_id: number;
  option_group_name: string;
  option_id: number;
  product_variant_id: number;
}

/** 'ProductVariantsOptionsListOptionsQuery' query type */
export interface IProductVariantsOptionsListOptionsQueryQuery {
  params: IProductVariantsOptionsListOptionsQueryParams;
  result: IProductVariantsOptionsListOptionsQueryResult;
}

/** 'ProductVariantDeleteQuery' parameters type */
export interface IProductVariantDeleteQueryParams {
  id: number;
}

/** 'ProductVariantDeleteQuery' return type */
export interface IProductVariantDeleteQueryResult {
  id: number;
}

/** 'ProductVariantDeleteQuery' query type */
export interface IProductVariantDeleteQueryQuery {
  params: IProductVariantDeleteQueryParams;
  result: IProductVariantDeleteQueryResult;
}

/** 'ProductVariantsOptionsDeleteQuery' parameters type */
export interface IProductVariantsOptionsDeleteQueryParams {
  product_variant_id: number;
}

/** 'ProductVariantsOptionsDeleteQuery' return type */
export type IProductVariantsOptionsDeleteQueryResult = void;

/** 'ProductVariantsOptionsDeleteQuery' query type */
export interface IProductVariantsOptionsDeleteQueryQuery {
  params: IProductVariantsOptionsDeleteQueryParams;
  result: IProductVariantsOptionsDeleteQueryResult;
}

/** 'ProductVariantsDescriptionsDeleteQuery' parameters type */
export interface IProductVariantsDescriptionsDeleteQueryParams {
  product_variant_id: number;
}

/** 'ProductVariantsDescriptionsDeleteQuery' return type */
export type IProductVariantsDescriptionsDeleteQueryResult = void;

/** 'ProductVariantsDescriptionsDeleteQuery' query type */
export interface IProductVariantsDescriptionsDeleteQueryQuery {
  params: IProductVariantsDescriptionsDeleteQueryParams;
  result: IProductVariantsDescriptionsDeleteQueryResult;
}

/** 'ProductVariantOptionsUpsertQuery' parameters type */
export interface IProductVariantOptionsUpsertQueryParams {
  values: readonly {
    product_variant_id: number;
    option_id: number;
  }[];
}

/** 'ProductVariantOptionsUpsertQuery' return type */
export type IProductVariantOptionsUpsertQueryResult = void;

/** 'ProductVariantOptionsUpsertQuery' query type */
export interface IProductVariantOptionsUpsertQueryQuery {
  params: IProductVariantOptionsUpsertQueryParams;
  result: IProductVariantOptionsUpsertQueryResult;
}

/** 'ProductVariantsFindOneQuery' parameters type */
export interface IProductVariantsFindOneQueryParams {
  id?: number | null | void;
  slug?: string | null | void;
}

/** 'ProductVariantsFindOneQuery' return type */
export interface IProductVariantsFindOneQueryResult {
  article: string;
  barcode: string;
  created_at: Date | null;
  discount: number;
  id: number;
  images: string | string[] | Record<string, any>;
  is_active: boolean;
  old_price: number;
  popularity: number;
  price: number;
  product_id: number;
  slug: string;
  stock_status: product_variant_stock_status;
}

/** 'ProductVariantsFindOneQuery' query type */
export interface IProductVariantsFindOneQueryQuery {
  params: IProductVariantsFindOneQueryParams;
  result: IProductVariantsFindOneQueryResult;
}

/** 'ProductVariantViewQuery' parameters type */
export interface IProductVariantViewQueryParams {
  id?: number | null | void;
  language_id: number;
  slug?: string | null | void;
}

/** 'ProductVariantViewQuery' return type */
export interface IProductVariantViewQueryResult {
  article: string;
  description: string | null;
  discount: number;
  id: number;
  images: string | string[] | Record<string, any>;
  name: string;
  old_price: number;
  price: number;
  product_id: number;
  short_description: string | null;
  slug: string;
  stock_status: product_variant_stock_status;
  vendor: string;
}

/** 'ProductVariantViewQuery' query type */
export interface IProductVariantViewQueryQuery {
  params: IProductVariantViewQueryParams;
  result: IProductVariantViewQueryResult;
}

/** 'ProductVariantRelatedVariantsQuery' parameters type */
export interface IProductVariantRelatedVariantsQueryParams {
  language_id: number;
  product_id: number;
}

/** 'ProductVariantRelatedVariantsQuery' return type */
export interface IProductVariantRelatedVariantsQueryResult {
  option_group_id: number;
  option_group_name: string;
  option_id: number;
  option_name: string;
  product_id: number;
  product_variant_id: number;
  slug: string;
  stock_status: product_variant_stock_status;
}

/** 'ProductVariantRelatedVariantsQuery' query type */
export interface IProductVariantRelatedVariantsQueryQuery {
  params: IProductVariantRelatedVariantsQueryParams;
  result: IProductVariantRelatedVariantsQueryResult;
}

/** 'ProductVariantsListAllQuery' parameters type */
export interface IProductVariantsListAllQueryParams {
  language_id: number;
}

/** 'ProductVariantsListAllQuery' return type */
export interface IProductVariantsListAllQueryResult {
  article: string;
  barcode: string;
  category: string;
  category_id: number;
  created_at: Date | null;
  description: string | null;
  discount: number;
  id: number;
  images: string | string[] | Record<string, any>;
  is_active: boolean;
  name: string;
  old_price: number;
  popularity: number;
  price: number;
  product_id: number;
  slug: string;
  stock_status: product_variant_stock_status;
  vendor: string;
}

/** 'ProductVariantsListAllQuery' query type */
export interface IProductVariantsListAllQueryQuery {
  params: IProductVariantsListAllQueryParams;
  result: IProductVariantsListAllQueryResult;
}
