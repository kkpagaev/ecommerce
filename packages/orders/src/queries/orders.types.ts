/** Types generated for queries found in "src/orders.js" */
export type order_status = 'cancelled' | 'created' | 'processing' | 'shipped';

export type NumberOrString = number | string;

/** 'OrderCreateQuery' parameters type */
export interface IOrderCreateQueryParams {
  price?: NumberOrString | null | void;
}

/** 'OrderCreateQuery' return type */
export interface IOrderCreateQueryResult {
  created_at: Date;
  id: number;
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
    product_id: number,
    option_id: number,
    price: NumberOrString,
    quantity: NumberOrString
  })[];
}

/** 'OrderItemsInsertQuery' return type */
export interface IOrderItemsInsertQueryResult {
  id: number;
  option_id: number;
  order_id: string;
  price: string;
  product_id: number;
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

