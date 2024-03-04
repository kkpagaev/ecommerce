/** Types generated for queries found in "src/location.ts" */

/** 'LocationCreateQuery' parameters type */
export interface ILocationCreateQueryParams {
  name: string;
}

/** 'LocationCreateQuery' return type */
export interface ILocationCreateQueryResult {
  id: number;
}

/** 'LocationCreateQuery' query type */
export interface ILocationCreateQueryQuery {
  params: ILocationCreateQueryParams;
  result: ILocationCreateQueryResult;
}

/** 'LocationUpdateQuery' parameters type */
export interface ILocationUpdateQueryParams {
  id: number;
  name?: string | null | void;
}

/** 'LocationUpdateQuery' return type */
export type ILocationUpdateQueryResult = void;

/** 'LocationUpdateQuery' query type */
export interface ILocationUpdateQueryQuery {
  params: ILocationUpdateQueryParams;
  result: ILocationUpdateQueryResult;
}

/** 'LocationListQuery' parameters type */
export type ILocationListQueryParams = void;

/** 'LocationListQuery' return type */
export interface ILocationListQueryResult {
  id: number;
  name: string;
}

/** 'LocationListQuery' query type */
export interface ILocationListQueryQuery {
  params: ILocationListQueryParams;
  result: ILocationListQueryResult;
}

/** 'LocationDeleteQuery' parameters type */
export interface ILocationDeleteQueryParams {
  id: number;
}

/** 'LocationDeleteQuery' return type */
export type ILocationDeleteQueryResult = void;

/** 'LocationDeleteQuery' query type */
export interface ILocationDeleteQueryQuery {
  params: ILocationDeleteQueryParams;
  result: ILocationDeleteQueryResult;
}

/** 'LocationFindOneQuery' parameters type */
export interface ILocationFindOneQueryParams {
  id?: number | null | void;
  name?: string | null | void;
}

/** 'LocationFindOneQuery' return type */
export interface ILocationFindOneQueryResult {
  id: number;
  name: string;
}

/** 'LocationFindOneQuery' query type */
export interface ILocationFindOneQueryQuery {
  params: ILocationFindOneQueryParams;
  result: ILocationFindOneQueryResult;
}

