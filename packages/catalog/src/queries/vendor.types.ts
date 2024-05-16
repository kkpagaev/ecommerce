/** Types generated for queries found in "src/vendor.js" */

/** 'VendorCreateQuery' parameters type */
export interface IVendorCreateQueryParams {
  name: string;
}

/** 'VendorCreateQuery' return type */
export interface IVendorCreateQueryResult {
  id: number;
}

/** 'VendorCreateQuery' query type */
export interface IVendorCreateQueryQuery {
  params: IVendorCreateQueryParams;
  result: IVendorCreateQueryResult;
}

/** 'VendorUpdateQuery' parameters type */
export interface IVendorUpdateQueryParams {
  id: number;
  name?: string | null | void;
}

/** 'VendorUpdateQuery' return type */
export interface IVendorUpdateQueryResult {
  id: number;
  name: string;
}

/** 'VendorUpdateQuery' query type */
export interface IVendorUpdateQueryQuery {
  params: IVendorUpdateQueryParams;
  result: IVendorUpdateQueryResult;
}

/** 'VendorDeleteQuery' parameters type */
export interface IVendorDeleteQueryParams {
  id: number;
}

/** 'VendorDeleteQuery' return type */
export interface IVendorDeleteQueryResult {
  id: number;
  name: string;
}

/** 'VendorDeleteQuery' query type */
export interface IVendorDeleteQueryQuery {
  params: IVendorDeleteQueryParams;
  result: IVendorDeleteQueryResult;
}

/** 'VendorGetQuery' parameters type */
export interface IVendorGetQueryParams {
  id: number;
}

/** 'VendorGetQuery' return type */
export interface IVendorGetQueryResult {
  id: number;
  name: string;
}

/** 'VendorGetQuery' query type */
export interface IVendorGetQueryQuery {
  params: IVendorGetQueryParams;
  result: IVendorGetQueryResult;
}

/** 'VendorListQuery' parameters type */
export type IVendorListQueryParams = void;

/** 'VendorListQuery' return type */
export interface IVendorListQueryResult {
  id: number;
  name: string;
}

/** 'VendorListQuery' query type */
export interface IVendorListQueryQuery {
  params: IVendorListQueryParams;
  result: IVendorListQueryResult;
}

