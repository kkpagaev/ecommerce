/** Types generated for queries found in "src/index.ts" */

/** 'AdminCreateQuery' parameters type */
export interface IAdminCreateQueryParams {
  email: string;
  name?: string | null | void;
  password: string;
  surname?: string | null | void;
}

/** 'AdminCreateQuery' return type */
export interface IAdminCreateQueryResult {
  id: number;
}

/** 'AdminCreateQuery' query type */
export interface IAdminCreateQueryQuery {
  params: IAdminCreateQueryParams;
  result: IAdminCreateQueryResult;
}

/** 'AdminUpdateQuery' parameters type */
export interface IAdminUpdateQueryParams {
  email?: string | null | void;
  id: number;
  name?: string | null | void;
  password?: string | null | void;
  surname?: string | null | void;
}

/** 'AdminUpdateQuery' return type */
export interface IAdminUpdateQueryResult {
  id: number;
}

/** 'AdminUpdateQuery' query type */
export interface IAdminUpdateQueryQuery {
  params: IAdminUpdateQueryParams;
  result: IAdminUpdateQueryResult;
}

/** 'AdminFindOneQuery' parameters type */
export interface IAdminFindOneQueryParams {
  email?: string | null | void;
  id?: number | null | void;
}

/** 'AdminFindOneQuery' return type */
export interface IAdminFindOneQueryResult {
  created_at: Date;
  email: string;
  id: number;
  name: string | null;
  password: string;
  surname: string | null;
}

/** 'AdminFindOneQuery' query type */
export interface IAdminFindOneQueryQuery {
  params: IAdminFindOneQueryParams;
  result: IAdminFindOneQueryResult;
}

/** 'AdminDeleteQuery' parameters type */
export interface IAdminDeleteQueryParams {
  id: number;
}

/** 'AdminDeleteQuery' return type */
export type IAdminDeleteQueryResult = void;

/** 'AdminDeleteQuery' query type */
export interface IAdminDeleteQueryQuery {
  params: IAdminDeleteQueryParams;
  result: IAdminDeleteQueryResult;
}

/** 'AdminListQuery' parameters type */
export interface IAdminListQueryParams {
  limit?: number | null | void;
  page?: number | null | void;
}

/** 'AdminListQuery' return type */
export interface IAdminListQueryResult {
  created_at: Date;
  email: string;
  id: number;
  name: string | null;
  password: string;
  surname: string | null;
}

/** 'AdminListQuery' query type */
export interface IAdminListQueryQuery {
  params: IAdminListQueryParams;
  result: IAdminListQueryResult;
}

/** 'AdminListCountQuery' parameters type */
export type IAdminListCountQueryParams = void;

/** 'AdminListCountQuery' return type */
export interface IAdminListCountQueryResult {
  count: string | null;
}

/** 'AdminListCountQuery' query type */
export interface IAdminListCountQueryQuery {
  params: IAdminListCountQueryParams;
  result: IAdminListCountQueryResult;
}
