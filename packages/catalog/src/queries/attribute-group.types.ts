/** Types generated for queries found in "src/attribute-group.ts" */

/** 'AttributeGroupFindOneQuery' parameters type */
export interface IAttributeGroupFindOneQueryParams {
  id?: number | null | void;
}

/** 'AttributeGroupFindOneQuery' return type */
export interface IAttributeGroupFindOneQueryResult {
  id: number;
  sort_order: number;
}

/** 'AttributeGroupFindOneQuery' query type */
export interface IAttributeGroupFindOneQueryQuery {
  params: IAttributeGroupFindOneQueryParams;
  result: IAttributeGroupFindOneQueryResult;
}

/** 'AttributeGroupDescriptionListQuery' parameters type */
export interface IAttributeGroupDescriptionListQueryParams {
  attribute_group_id: number;
}

/** 'AttributeGroupDescriptionListQuery' return type */
export interface IAttributeGroupDescriptionListQueryResult {
  attribute_group_id: number;
  description: string | null;
  language_id: number;
  name: string;
}

/** 'AttributeGroupDescriptionListQuery' query type */
export interface IAttributeGroupDescriptionListQueryQuery {
  params: IAttributeGroupDescriptionListQueryParams;
  result: IAttributeGroupDescriptionListQueryResult;
}

/** 'AttributeListQuery' parameters type */
export interface IAttributeListQueryParams {
  attribute_group_id?: number | null | void;
  language_id: number;
}

/** 'AttributeListQuery' return type */
export interface IAttributeListQueryResult {
  attribute_group_id: number;
  attribute_id: number;
  id: number;
  language_id: number;
  name: string;
}

/** 'AttributeListQuery' query type */
export interface IAttributeListQueryQuery {
  params: IAttributeListQueryParams;
  result: IAttributeListQueryResult;
}

/** 'AttributeGroupUpdateQuery' parameters type */
export interface IAttributeGroupUpdateQueryParams {
  id: number;
  sort_order?: number | null | void;
}

/** 'AttributeGroupUpdateQuery' return type */
export interface IAttributeGroupUpdateQueryResult {
  id: number;
}

/** 'AttributeGroupUpdateQuery' query type */
export interface IAttributeGroupUpdateQueryQuery {
  params: IAttributeGroupUpdateQueryParams;
  result: IAttributeGroupUpdateQueryResult;
}

/** 'AttributeGroupDescriptionUpsertQuery' parameters type */
export interface IAttributeGroupDescriptionUpsertQueryParams {
  values: readonly ({
    attribute_group_id: number,
    language_id: number,
    name: string,
    description: string | null | void
  })[];
}

/** 'AttributeGroupDescriptionUpsertQuery' return type */
export interface IAttributeGroupDescriptionUpsertQueryResult {
  attribute_group_id: number;
  description: string | null;
  language_id: number;
  name: string;
}

/** 'AttributeGroupDescriptionUpsertQuery' query type */
export interface IAttributeGroupDescriptionUpsertQueryQuery {
  params: IAttributeGroupDescriptionUpsertQueryParams;
  result: IAttributeGroupDescriptionUpsertQueryResult;
}

/** 'AttributeGroupCreateQuery' parameters type */
export interface IAttributeGroupCreateQueryParams {
  sort_order: number;
}

/** 'AttributeGroupCreateQuery' return type */
export interface IAttributeGroupCreateQueryResult {
  id: number;
}

/** 'AttributeGroupCreateQuery' query type */
export interface IAttributeGroupCreateQueryQuery {
  params: IAttributeGroupCreateQueryParams;
  result: IAttributeGroupCreateQueryResult;
}

