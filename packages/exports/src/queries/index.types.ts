/** Types generated for queries found in "src/index.js" */

/** 'LanguageCreateQuery' parameters type */
export interface ILanguageCreateQueryParams {
  name: string;
}

/** 'LanguageCreateQuery' return type */
export interface ILanguageCreateQueryResult {
  id: number;
}

/** 'LanguageCreateQuery' query type */
export interface ILanguageCreateQueryQuery {
  params: ILanguageCreateQueryParams;
  result: ILanguageCreateQueryResult;
}

/** 'LanguageUpdateQuery' parameters type */
export interface ILanguageUpdateQueryParams {
  id: number;
  name?: string | null | void;
}

/** 'LanguageUpdateQuery' return type */
export interface ILanguageUpdateQueryResult {
  id: number;
  name: string;
}

/** 'LanguageUpdateQuery' query type */
export interface ILanguageUpdateQueryQuery {
  params: ILanguageUpdateQueryParams;
  result: ILanguageUpdateQueryResult;
}

/** 'LanguageDeleteQuery' parameters type */
export interface ILanguageDeleteQueryParams {
  id: number;
}

/** 'LanguageDeleteQuery' return type */
export interface ILanguageDeleteQueryResult {
  id: number;
  name: string;
}

/** 'LanguageDeleteQuery' query type */
export interface ILanguageDeleteQueryQuery {
  params: ILanguageDeleteQueryParams;
  result: ILanguageDeleteQueryResult;
}

/** 'LanguageGetQuery' parameters type */
export interface ILanguageGetQueryParams {
  id: number;
}

/** 'LanguageGetQuery' return type */
export interface ILanguageGetQueryResult {
  id: number;
  name: string;
}

/** 'LanguageGetQuery' query type */
export interface ILanguageGetQueryQuery {
  params: ILanguageGetQueryParams;
  result: ILanguageGetQueryResult;
}

/** 'LanguageListQuery' parameters type */
export type ILanguageListQueryParams = void;

/** 'LanguageListQuery' return type */
export interface ILanguageListQueryResult {
  id: number;
  name: string;
}

/** 'LanguageListQuery' query type */
export interface ILanguageListQueryQuery {
  params: ILanguageListQueryParams;
  result: ILanguageListQueryResult;
}

