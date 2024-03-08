/** Types generated for queries found in "src/stocks.js" */

/** 'StockUpsertQuery' parameters type */
export interface IStockUpsertQueryParams {
  values: readonly ({
    product_id: number,
    attribute_id: number,
    location_id: number,
    count: number
  })[];
}

/** 'StockUpsertQuery' return type */
export interface IStockUpsertQueryResult {
  attribute_id: number;
  count: number;
  location_id: number;
  product_id: number;
}

/** 'StockUpsertQuery' query type */
export interface IStockUpsertQueryQuery {
  params: IStockUpsertQueryParams;
  result: IStockUpsertQueryResult;
}

