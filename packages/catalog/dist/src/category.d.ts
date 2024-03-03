import { Pool } from "pg";
import { Translation } from "./i18n";
import { ICategoryListQueryParams } from "./queries.types";
export type Categories = ReturnType<typeof Categories>;
export declare function Categories(f: {
    pool: Pool;
}): {
    listCategories: (input: ICategoryListQueryParams) => Promise<{
        data: import("./queries.types").ICategoryListQueryResult[];
        count: number;
    }>;
    findCategoryById: (id: number) => Promise<import("./queries.types").ICategoryFindByIdQueryResult>;
    createCategory: (input: CreateCategoryProps) => Promise<import("./queries.types").ICategoryCreateQueryResult>;
    updateCategory: (id: number, input: UpdateCategoryProps) => Promise<void[]>;
};
export declare function listCategories(pool: Pool, input: ICategoryListQueryParams): Promise<{
    data: import("./queries.types").ICategoryListQueryResult[];
    count: number;
}>;
export declare function findCategoryById(pool: Pool, id: number): Promise<import("./queries.types").ICategoryFindByIdQueryResult>;
type CreateCategoryProps = {
    name: Translation;
    description?: Translation;
};
export declare function createCategory(pool: Pool, input: CreateCategoryProps): Promise<import("./queries.types").ICategoryCreateQueryResult>;
type UpdateCategoryProps = {
    name?: Translation;
    description?: Translation;
};
export declare function updateCategory(pool: Pool, id: number, input: UpdateCategoryProps): Promise<void[]>;
export {};
//# sourceMappingURL=category.d.ts.map