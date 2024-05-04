/** Types generated for queries found in "src/index.ts" */

/** 'FileUploadInsertQuery' parameters type */
export interface IFileUploadInsertQueryParams {
  filename?: string | null | void;
  id?: string | null | void;
  mimetype?: string | null | void;
  url?: string | null | void;
}

/** 'FileUploadInsertQuery' return type */
export interface IFileUploadInsertQueryResult {
  created_at: Date | null;
  filename: string;
  id: string;
  mimetype: string;
  url: string;
}

/** 'FileUploadInsertQuery' query type */
export interface IFileUploadInsertQueryQuery {
  params: IFileUploadInsertQueryParams;
  result: IFileUploadInsertQueryResult;
}

/** 'FileUploadListQuery' parameters type */
export type IFileUploadListQueryParams = void;

/** 'FileUploadListQuery' return type */
export interface IFileUploadListQueryResult {
  created_at: Date | null;
  filename: string;
  id: string;
  mimetype: string;
  url: string;
}

/** 'FileUploadListQuery' query type */
export interface IFileUploadListQueryQuery {
  params: IFileUploadListQueryParams;
  result: IFileUploadListQueryResult;
}

