/** Types generated for queries found in "src/attribute.ts" */

/** 'AttributeCreateQuery' parameters type */
export interface IAttributeCreateQueryParams {
  attributeGroupId: number;
}

/** 'AttributeCreateQuery' return type */
export interface IAttributeCreateQueryResult {
  id: number;
}

/** 'AttributeCreateQuery' query type */
export interface IAttributeCreateQueryQuery {
  params: IAttributeCreateQueryParams;
  result: IAttributeCreateQueryResult;
}

/** 'AttributeDescriptionUpsertQuery' parameters type */
export interface IAttributeDescriptionUpsertQueryParams {
  values: readonly ({
    attributeId: number,
    languageId: number,
    name: string
  })[];
}

/** 'AttributeDescriptionUpsertQuery' return type */
export type IAttributeDescriptionUpsertQueryResult = void;

/** 'AttributeDescriptionUpsertQuery' query type */
export interface IAttributeDescriptionUpsertQueryQuery {
  params: IAttributeDescriptionUpsertQueryParams;
  result: IAttributeDescriptionUpsertQueryResult;
}

