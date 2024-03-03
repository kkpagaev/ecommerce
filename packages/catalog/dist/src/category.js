import slugify from "slugify";
import { catalogQueries } from "./queries";
export function Categories(f) {
    return {
        listCategories: listCategories.bind(null, f.pool),
        findCategoryById: findCategoryById.bind(null, f.pool),
        createCategory: createCategory.bind(null, f.pool),
        updateCategory: updateCategory.bind(null, f.pool),
    };
}
export async function listCategories(pool, input) {
    const res = await catalogQueries.category.list.run({
        page: input.page,
        limit: input.limit,
    }, pool);
    const count = await catalogQueries.category.listCount.run(undefined, pool);
    return {
        data: res,
        count: +(count[0].count ?? 0),
    };
}
export async function findCategoryById(pool, id) {
    const res = await catalogQueries.category.findById.run({ id }, pool);
    return res[0];
}
export async function createCategory(pool, input) {
    const slug = slugify(input.name.uk);
    const res = await catalogQueries.category.create.run({
        name: input.name,
        description: input.description,
        slug,
    }, pool);
    return res[0];
}
export async function updateCategory(pool, id, input) {
    const slug = input.name ? slugify(input.name.uk) : undefined;
    return await catalogQueries.category.update.run({
        name: input.name,
        description: input.description,
        slug,
        id,
    }, pool);
}
//# sourceMappingURL=category.js.map