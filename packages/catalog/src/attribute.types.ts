/** Types generated for queries found in "src/attribute.ts" */

/** 'AttributeDescriptionDeleteQuery' parameters type */
export interface IAttributeDescriptionDeleteQueryParams {
  attributeId: number;
  languageId: number;
}

/** 'AttributeDescriptionDeleteQuery' return type */
export type IAttributeDescriptionDeleteQueryResult = void;

/** 'AttributeDescriptionDeleteQuery' query type */
export interface IAttributeDescriptionDeleteQueryQuery {
  params: IAttributeDescriptionDeleteQueryParams;
  result: IAttributeDescriptionDeleteQueryResult;
}

/** 'AttributeDeletQuery' parameters type */
export interface IAttributeDeletQueryParams {
  id: number;
}

/** 'AttributeDeletQuery' return type */
export type IAttributeDeletQueryResult = void;

/** 'AttributeDeletQuery' query type */
export interface IAttributeDeletQueryQuery {
  params: IAttributeDeletQueryParams;
  result: IAttributeDeletQueryResult;
}

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

