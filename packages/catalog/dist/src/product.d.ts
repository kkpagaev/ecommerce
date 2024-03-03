import { Pool } from "pg";
import { Translation } from "./i18n";
export type Products = ReturnType<typeof Products>;
export declare function Products(f: {
    pool: Pool;
}): {
    listProducts: (input: ListProductsProps) => Promise<{
        data: import("./queries.types").IProductListQueryResult[];
        count: number;
    }>;
    deleteProduct: (props: DeleteProductProps) => Promise<number | undefined>;
    findOneProduct: (props: FindOneProductProps) => Promise<{
        attributes: import("./queries.types").IProductAttributeValueListQueryResult[];
        category_id: number | null;
        created_at: Date;
        description: Translation | null;
        id: number;
        name: Translation;
        slug: string;
        updated_at: Date;
    } | null>;
    createProduct: (input: CreateProductProps) => Promise<import("./queries.types").IProductCreateQueryResult>;
    updateProduct: (id: number, input: Partial<CreateProductProps>) => Promise<void>;
};
type CreateProductProps = {
    categoryId: number;
    name: Translation;
    price: number;
    attributes?: Array<number>;
    description?: Translation;
};
type FindOneProductProps = {
    id?: number;
};
export declare function findOneProduct(pool: Pool, props: FindOneProductProps): Promise<{
    attributes: import("./queries.types").IProductAttributeValueListQueryResult[];
    category_id: number | null;
    created_at: Date;
    description: Translation | null;
    id: number;
    name: Translation;
    slug: string;
    updated_at: Date;
} | null>;
type DeleteProductProps = {
    id: number;
};
export declare function deleteProduct(pool: Pool, props: DeleteProductProps): Promise<number | undefined>;
type ListProductsProps = {
    limit?: number;
    page?: number;
};
export declare function listProducts(pool: Pool, input: ListProductsProps): Promise<{
    data: import("./queries.types").IProductListQueryResult[];
    count: number;
}>;
export {};
//# sourceMappingURL=product.d.ts.map