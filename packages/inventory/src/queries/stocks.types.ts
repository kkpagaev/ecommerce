/** Types generated for queries found in "src/stocks.js" */

/** 'StockUpsertQuery' parameters type */
export interface IStockUpsertQueryParams {
  values: readonly ({
    product_variant_id: number,
    location_id: number,
    count: number
  })[];
}

/** 'StockUpsertQuery' return type */
export interface IStockUpsertQueryResult {
  count: number;
  location_id: number;
  product_variant_id: number;
}

/** 'StockUpsertQuery' query type */
export interface IStockUpsertQueryQuery {
  params: IStockUpsertQueryParams;
  result: IStockUpsertQueryResult;
}

/** 'ProductStocksListQuery' parameters type */
export interface IProductStocksListQueryParams {
  language_id: number;
}

/** 'ProductStocksListQuery' return type */
export interface IProductStocksListQueryResult {
  count: string | null;
  id: number;
  images: string[] | null;
  name: string;
}

/** 'ProductStocksListQuery' query type */
export interface IProductStocksListQueryQuery {
  params: IProductStocksListQueryParams;
  result: IProductStocksListQueryResult;
}

/** 'StocksListQuery' parameters type */
export interface IStocksListQueryParams {
  location_id?: number | null | void;
  product_variant_id?: number | null | void;
}

/** 'StocksListQuery' return type */
export interface IStocksListQueryResult {
  count: number;
  location_id: number;
  product_variant_id: number;
}

/** 'StocksListQuery' query type */
export interface IStocksListQueryQuery {
  params: IStocksListQueryParams;
  result: IStocksListQueryResult;
}

/** 'StockTotalStockQuery' parameters type */
export interface IStockTotalStockQueryParams {
  values: readonly ({
    product_variant_id: number
  })[];
}

/** 'StockTotalStockQuery' return type */
export interface IStockTotalStockQueryResult {
  count: number | null;
  product_variant_id: number;
}

/** 'StockTotalStockQuery' query type */
export interface IStockTotalStockQueryQuery {
  params: IStockTotalStockQueryParams;
  result: IStockTotalStockQueryResult;
}

