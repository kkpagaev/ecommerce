import { IAttributeFindByIdQueryQuery, IAttributeFindOneQueryQuery, IAttributeValueDeleteManyQueryQuery, IAttributeValueIdListQueryQuery, IProductUpdateQueryQuery, IProductDeleteQueryQuery, IProductAttributeValueListQueryQuery, IProductFindOneQueryQuery, IProductAttributeVAlueInsertQueryQuery, IProductAttributeValueDeleteQueryQuery, IProductCreateQueryQuery, IPriceUpsertQueryQuery, IProductListCountQueryQuery, IProductListQueryQuery, IProductFindByIdQueryQuery, IAttributeValueDeleteQueryQuery, IAttributeListCountQueryQuery, IAttributeListQueryQuery, IAttributeDeleteQueryQuery, IAttributeUpdateQueryQuery, IAttributeCreateQueryQuery, IAttributeValueCreateQueryQuery, IAttributeValueListQueryQuery, ICategoryCreateQueryQuery, ICategoryFindByIdQueryQuery, ICategoryUpdateQueryQuery, ICategoryListCountQueryQuery, ICategoryListQueryQuery, IAttributeValueUpdateQueryQuery } from "./queries.types";
import { PoolClient } from "pg";
import { Translation } from "./i18n";
export declare const attributeFindByIdQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeFindByIdQueryQuery>;
export declare const attributeFindOneQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeFindOneQueryQuery>;
export declare const attributeListCountQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeListCountQueryQuery>;
export declare const attributeListQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeListQueryQuery>;
export declare const attributeCreateQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeCreateQueryQuery>;
export declare const attributeUpdateQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeUpdateQueryQuery>;
export declare const attributeDeleteQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeDeleteQueryQuery>;
export declare const attributeValueListQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeValueListQueryQuery>;
export declare const attributeValueIdListQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeValueIdListQueryQuery>;
export declare const attributeValueCreateQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeValueCreateQueryQuery>;
export declare const attributeValueUpdateQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeValueUpdateQueryQuery>;
export declare const attributeValueDeleteQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeValueDeleteQueryQuery>;
export declare const attributeValueDeleteManyQuery: import("@pgtyped/runtime").TaggedQuery<IAttributeValueDeleteManyQueryQuery>;
export interface IAttributeValueUpsertQueryParams {
    values: readonly ({
        id: number | null | void;
        attributeId: number;
        value: Translation;
    })[];
}
export declare function attributeValueUpsertQuery({ values }: IAttributeValueUpsertQueryParams, client: PoolClient): Promise<any>;
export declare const categoryListCountQuery: import("@pgtyped/runtime").TaggedQuery<ICategoryListCountQueryQuery>;
export declare const categoryListQuery: import("@pgtyped/runtime").TaggedQuery<ICategoryListQueryQuery>;
export declare const categoryFindByIdQuery: import("@pgtyped/runtime").TaggedQuery<ICategoryFindByIdQueryQuery>;
export declare const categoryCreateQuery: import("@pgtyped/runtime").TaggedQuery<ICategoryCreateQueryQuery>;
export declare const categoryUpdateQuery: import("@pgtyped/runtime").TaggedQuery<ICategoryUpdateQueryQuery>;
export declare const productListQuery: import("@pgtyped/runtime").TaggedQuery<IProductListQueryQuery>;
export declare const productFindOneQuery: import("@pgtyped/runtime").TaggedQuery<IProductFindOneQueryQuery>;
export declare const productDeleteQuery: import("@pgtyped/runtime").TaggedQuery<IProductDeleteQueryQuery>;
export declare const productCreateQuery: import("@pgtyped/runtime").TaggedQuery<IProductCreateQueryQuery>;
export declare const productUpdateQuery: import("@pgtyped/runtime").TaggedQuery<IProductUpdateQueryQuery>;
export declare const productAttributeValueListQuery: import("@pgtyped/runtime").TaggedQuery<IProductAttributeValueListQueryQuery>;
export declare const productAttributeValueDeleteQuery: import("@pgtyped/runtime").TaggedQuery<IProductAttributeValueDeleteQueryQuery>;
export declare const productAttributeVAlueInsertQuery: import("@pgtyped/runtime").TaggedQuery<IProductAttributeVAlueInsertQueryQuery>;
export declare const productListCountQuery: import("@pgtyped/runtime").TaggedQuery<IProductListCountQueryQuery>;
export declare const productFindByIdQuery: import("@pgtyped/runtime").TaggedQuery<IProductFindByIdQueryQuery>;
export declare const priceUpsertQuery: import("@pgtyped/runtime").TaggedQuery<IPriceUpsertQueryQuery>;
export declare const catalogQueries: {
    category: {
        create: import("@pgtyped/runtime").TaggedQuery<ICategoryCreateQueryQuery>;
        update: import("@pgtyped/runtime").TaggedQuery<ICategoryUpdateQueryQuery>;
        list: import("@pgtyped/runtime").TaggedQuery<ICategoryListQueryQuery>;
        listCount: import("@pgtyped/runtime").TaggedQuery<ICategoryListCountQueryQuery>;
        findById: import("@pgtyped/runtime").TaggedQuery<ICategoryFindByIdQueryQuery>;
    };
    attribute: {
        findOne: import("@pgtyped/runtime").TaggedQuery<IAttributeFindOneQueryQuery>;
        list: import("@pgtyped/runtime").TaggedQuery<IAttributeListQueryQuery>;
        listCount: import("@pgtyped/runtime").TaggedQuery<IAttributeListCountQueryQuery>;
        findById: import("@pgtyped/runtime").TaggedQuery<IAttributeFindByIdQueryQuery>;
        create: import("@pgtyped/runtime").TaggedQuery<IAttributeCreateQueryQuery>;
        update: import("@pgtyped/runtime").TaggedQuery<IAttributeUpdateQueryQuery>;
        delete: import("@pgtyped/runtime").TaggedQuery<IAttributeDeleteQueryQuery>;
    };
    attributeValue: {
        upsert: {
            run: typeof attributeValueUpsertQuery;
        };
        deleteMany: import("@pgtyped/runtime").TaggedQuery<IAttributeValueDeleteManyQueryQuery>;
        idList: import("@pgtyped/runtime").TaggedQuery<IAttributeValueIdListQueryQuery>;
        create: import("@pgtyped/runtime").TaggedQuery<IAttributeValueCreateQueryQuery>;
        update: import("@pgtyped/runtime").TaggedQuery<IAttributeValueUpdateQueryQuery>;
        delete: import("@pgtyped/runtime").TaggedQuery<IAttributeValueDeleteQueryQuery>;
        list: import("@pgtyped/runtime").TaggedQuery<IAttributeValueListQueryQuery>;
    };
    productAttributeValue: {
        list: import("@pgtyped/runtime").TaggedQuery<IProductAttributeValueListQueryQuery>;
        create: import("@pgtyped/runtime").TaggedQuery<IProductAttributeVAlueInsertQueryQuery>;
        delete: import("@pgtyped/runtime").TaggedQuery<IProductAttributeValueDeleteQueryQuery>;
    };
    product: {
        update: import("@pgtyped/runtime").TaggedQuery<IProductUpdateQueryQuery>;
        delete: import("@pgtyped/runtime").TaggedQuery<IProductDeleteQueryQuery>;
        findOne: import("@pgtyped/runtime").TaggedQuery<IProductFindOneQueryQuery>;
        create: import("@pgtyped/runtime").TaggedQuery<IProductCreateQueryQuery>;
        listCount: import("@pgtyped/runtime").TaggedQuery<IProductListCountQueryQuery>;
        list: import("@pgtyped/runtime").TaggedQuery<IProductListQueryQuery>;
        findById: import("@pgtyped/runtime").TaggedQuery<IProductFindByIdQueryQuery>;
    };
    price: {
        upsert: import("@pgtyped/runtime").TaggedQuery<IPriceUpsertQueryQuery>;
    };
};
//# sourceMappingURL=queries.d.ts.map