import { catalogQueries as q } from "./queries";
import slugify from "slugify";
import { tx } from "@repo/pool";
export function Products(f) {
    return {
        listProducts: listProducts.bind(null, f.pool),
        deleteProduct: deleteProduct.bind(null, f.pool),
        findOneProduct: findOneProduct.bind(null, f.pool),
        createProduct: createProduct.bind(null, f.pool),
        updateProduct: updateProduct.bind(null, f.pool),
    };
}
async function createProduct(pool, input) {
    const slug = slugify(input.name.uk);
    return tx(pool, async (client) => {
        const product = await q.product.create.run({
            description: input.description,
            name: input.name,
            slug: slug,
            categoryId: input.categoryId,
        }, client).then((res) => res[0]);
        await q.price.upsert.run({
            values: [
                {
                    price: input.price,
                    type: "default",
                    product_id: product.id,
                },
            ],
        }, client);
        if (input.attributes) {
            await upsertAttributes(client, product.id, input.attributes);
        }
        return product;
    });
}
export async function findOneProduct(pool, props) {
    const product = await q.product.findOne.run({
        id: props.id,
    }, pool).then((res) => res[0]);
    if (!product) {
        return null;
    }
    const attributes = await q.productAttributeValue.list.run({
        productId: product.id,
    }, pool);
    return {
        ...product,
        attributes,
    };
}
async function upsertAttributes(client, id, attributes) {
    await q.productAttributeValue.delete.run({
        product_id: id,
    }, client);
    if (attributes.length !== 0) {
        await q.productAttributeValue.create.run({
            values: attributes.map((attrId) => ({
                attributeValueId: attrId,
                productId: id,
            })),
        }, client);
    }
}
async function updateProduct(pool, id, input) {
    const slug = input.name?.uk && slugify(input.name.uk);
    return tx(pool, async (client) => {
        await q.product.update.run({
            id: id,
            name: input.name,
            description: input.description,
            slug: slug,
            categoryId: input.categoryId,
        }, client);
        if (input.price) {
            await q.price.upsert.run({
                values: [
                    { price: input.price, type: "default", product_id: id },
                ],
            }, client);
        }
        if (input.attributes) {
            await upsertAttributes(client, id, input.attributes);
        }
    });
}
export async function deleteProduct(pool, props) {
    return q.product.delete.run({
        id: props.id,
    }, pool).then((res) => res[0]?.id);
}
export async function listProducts(pool, input) {
    const products = await q.product.list.run({
        limit: input.limit,
        page: input.page,
    }, pool);
    const count = await q.product.listCount.run(undefined, pool)
        .then((res) => +(res[0].count ?? 0));
    return {
        data: products,
        count: count,
    };
}
//# sourceMappingURL=product.js.map