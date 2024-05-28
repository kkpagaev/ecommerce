/** Types generated for queries found in "src/orders.js" */
export type order_status = 'cancelled' | 'created' | 'processing' | 'shipped';

export type product_variant_stock_status = 'in_stock' | 'out_of_stock' | 'preorder';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

/** 'OrderCreateQuery' parameters type */
export interface IOrderCreateQueryParams {
  information: Json;
  price: NumberOrString;
}

/** 'OrderCreateQuery' return type */
export interface IOrderCreateQueryResult {
  created_at: Date;
  id: number;
  information: Json | null;
  price: string | null;
  status: order_status;
}

/** 'OrderCreateQuery' query type */
export interface IOrderCreateQueryQuery {
  params: IOrderCreateQueryParams;
  result: IOrderCreateQueryResult;
}

/** 'OrderItemsInsertQuery' parameters type */
export interface IOrderItemsInsertQueryParams {
  values: readonly ({
    order_id: NumberOrString,
    product_variant_id: number,
    price: NumberOrString,
    quantity: NumberOrString
  })[];
}

/** 'OrderItemsInsertQuery' return type */
export interface IOrderItemsInsertQueryResult {
  id: number;
  order_id: string;
  price: string;
  product_variant_id: number;
  quantity: string;
}

/** 'OrderItemsInsertQuery' query type */
export interface IOrderItemsInsertQueryQuery {
  params: IOrderItemsInsertQueryParams;
  result: IOrderItemsInsertQueryResult;
}

/** 'OrderHistoryInsertQuery' parameters type */
export interface IOrderHistoryInsertQueryParams {
  order_id?: NumberOrString | null | void;
  status?: order_status | null | void;
}

/** 'OrderHistoryInsertQuery' return type */
export type IOrderHistoryInsertQueryResult = void;

/** 'OrderHistoryInsertQuery' query type */
export interface IOrderHistoryInsertQueryQuery {
  params: IOrderHistoryInsertQueryParams;
  result: IOrderHistoryInsertQueryResult;
}

/** 'ListProductVariantsQuery' parameters type */
export interface IListProductVariantsQueryParams {
  product_variant_ids: readonly (number | null | void)[];
}

/** 'ListProductVariantsQuery' return type */
export interface IListProductVariantsQueryResult {
  article: string;
  barcode: string;
  created_at: Date | null;
  discount: number;
  id: number;
  images: Json;
  is_active: boolean;
  old_price: number;
  popularity: number;
  price: number;
  product_id: number;
  slug: string;
  stock_status: product_variant_stock_status;
}

/** 'ListProductVariantsQuery' query type */
export interface IListProductVariantsQueryQuery {
  params: IListProductVariantsQueryParams;
  result: IListProductVariantsQueryResult;
}

