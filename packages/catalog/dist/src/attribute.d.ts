import { Translation } from "./i18n";
import { Pool, PoolClient } from "pg";
export type Attributes = ReturnType<typeof Attributes>;
export declare function Attributes(f: {
    pool: Pool;
}): {
    upsertAttributeValue: (attributeId: number, input: UpsertAttributeValueProps[]) => Promise<void>;
    createAttribute: (input: CreateAttributeProps) => Promise<import("./queries.types").IAttributeCreateQueryResult>;
    updateAttribute: (id: number, input: UpdateAttributeProps) => Promise<void[]>;
    findAttributeById: (id: number) => Promise<import("./queries.types").IAttributeFindByIdQueryResult[]>;
    findOneAttribute: (props: FindOneAttributeProps) => Promise<{
        values: import("./queries.types").IAttributeValueListQueryResult[];
        description: Translation | null;
        id: number;
        name: Translation;
    }>;
};
type CreateAttributeProps = {
    name: Translation;
    description?: Translation;
    values?: Omit<CreateAttributeValue, "attributeId">[];
};
export declare function createAttribute(pool: Pool, input: CreateAttributeProps): Promise<import("./queries.types").IAttributeCreateQueryResult>;
type UpdateAttributeProps = {
    name?: Translation;
    description?: Translation;
    values?: UpsertAttributeValueProps[];
};
export declare function updateAttribute(pool: Pool, id: number, input: UpdateAttributeProps): Promise<void[]>;
type CreateAttributeValue = {
    attributeId: number;
    value: Translation;
};
type CreateAttributeValueProps = CreateAttributeValue[];
export declare function createAttributeValue(pool: Pool, input: CreateAttributeValueProps): Promise<import("./queries.types").IAttributeValueCreateQueryResult[]>;
type UpsertAttributeValueProps = CreateAttributeValue & {
    id?: number;
};
export declare function upsertAttributeValue(pool: Pool, attributeId: number, input: UpsertAttributeValueProps[]): Promise<void>;
export declare function upsertAttributeValueTransaction(client: PoolClient, attributeId: number, input: UpsertAttributeValueProps[]): Promise<void>;
export declare function findAttributeById(pool: Pool, id: number): Promise<import("./queries.types").IAttributeFindByIdQueryResult[]>;
type FindOneAttributeProps = {
    id?: number;
};
export declare function findOneAttribute(pool: Pool, props: FindOneAttributeProps): Promise<{
    values: import("./queries.types").IAttributeValueListQueryResult[];
    description: Translation | null;
    id: number;
    name: Translation;
}>;
export {};
//# sourceMappingURL=attribute.d.ts.map