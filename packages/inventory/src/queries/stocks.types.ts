/** Types generated for queries found in "src/stocks.js" */

/** 'StockUpsertQuery' parameters type */
export interface IStockUpsertQueryParams {
  values: readonly ({
    product_id: number,
    option_id: number,
    location_id: number,
    count: number
  })[];
}

/** 'StockUpsertQuery' return type */
export interface IStockUpsertQueryResult {
  count: number;
  location_id: number;
  option_id: number;
  product_id: number;
}

/** 'StockUpsertQuery' query type */
export interface IStockUpsertQueryQuery {
  params: IStockUpsertQueryParams;
  result: IStockUpsertQueryResult;
}

/** 'StocksListQuery' parameters type */
export interface IStocksListQueryParams {
  location_id?: number | null | void;
  option_id?: number | null | void;
  product_id?: number | null | void;
}

/** 'StocksListQuery' return type */
export interface IStocksListQueryResult {
  count: number;
  location_id: number;
  option_id: number;
  product_id: number;
}

/** 'StocksListQuery' query type */
export interface IStocksListQueryQuery {
  params: IStocksListQueryParams;
  result: IStocksListQueryResult;
}

