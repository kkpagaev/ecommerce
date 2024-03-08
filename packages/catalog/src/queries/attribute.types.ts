/** Types generated for queries found in "src/attribute.js" */

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

/** 'AttributeFindOneQuery' parameters type */
export interface IAttributeFindOneQueryParams {
  id: number;
}

/** 'AttributeFindOneQuery' return type */
export interface IAttributeFindOneQueryResult {
  attribute_group_id: number;
  id: number;
}

/** 'AttributeFindOneQuery' query type */
export interface IAttributeFindOneQueryQuery {
  params: IAttributeFindOneQueryParams;
  result: IAttributeFindOneQueryResult;
}

/** 'AttributeDescriptionListQuery' parameters type */
export interface IAttributeDescriptionListQueryParams {
  attribute_id: number;
}

/** 'AttributeDescriptionListQuery' return type */
export interface IAttributeDescriptionListQueryResult {
  attribute_id: number;
  language_id: number;
  name: string;
}

/** 'AttributeDescriptionListQuery' query type */
export interface IAttributeDescriptionListQueryQuery {
  params: IAttributeDescriptionListQueryParams;
  result: IAttributeDescriptionListQueryResult;
}

