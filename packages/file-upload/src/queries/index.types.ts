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
