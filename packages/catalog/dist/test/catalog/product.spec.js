var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
import { describe, expect, it } from "vitest";
import { catalogQueries as q } from "../../src/queries";
import { Products } from "../../src";
import { testDB } from "../utils";
async function createProducts() {
    const db = await testDB();
    const products = Products({ pool: db.pool });
    return {
        products,
        db,
        [Symbol.asyncDispose]: db[Symbol.asyncDispose],
    };
}
async function fixture(pool) {
    const catId = await q.category.create.run({
        name: { uk: "test", en: "test", ru: "test" },
        slug: "test",
    }, pool).then((res) => res[0].id);
    const attributes = await q.attribute.create.run({
        values: [{
                name: { uk: "test", en: "test", ru: "test" },
                description: { uk: "test", en: "test", ru: "test" },
            },
            {
                name: { uk: "test2", en: "test2", ru: "test2" },
                description: { uk: "test2", en: "test2", ru: "test2" },
            }],
    }, pool).then((res) => res.map((r) => r.id));
    const attributeValues = await q.attributeValue.create.run({
        values: attributes.map((id) => {
            return {
                value: { uk: "value" + id, en: "value" + id, ru: "value" + id },
                attributeId: id,
            };
        }),
    }, pool).then((res) => res.map((r) => r.id));
    const product = await q.product.create.run({
        name: { uk: "test", en: "test", ru: "test" },
        description: { uk: "test", en: "test", ru: "test" },
        categoryId: catId,
        slug: "test",
    }, pool).then((res) => res[0]);
    await q.productAttributeValue.create.run({
        values: attributeValues.map((id) => ({
            productId: product.id,
            attributeValueId: id,
        })),
    }, pool);
    return { catId, attributes, attributeValues, product };
}
describe("Products", () => {
    describe("findOneProduct", () => {
        it("should find product by id", async () => {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const p = __addDisposableResource(env_1, await createProducts(), true);
                const fix = await fixture(p.db.pool);
                const product = await p.products.findOneProduct({
                    id: fix.product.id,
                });
                expect(product).toEqual({
                    id: fix.product.id,
                    name: { uk: "test", en: "test", ru: "test" },
                    description: { uk: "test", en: "test", ru: "test" },
                    attributes: expect.any(Array),
                    category_id: expect.any(Number),
                    slug: "test",
                    created_at: expect.any(Date),
                    updated_at: expect.any(Date),
                });
                expect(product?.attributes).toHaveLength(fix.attributeValues.length);
                expect(product?.attributes[0]).toEqual({
                    attribute_id: expect.any(Number),
                    attribute_name: expect.any(Object),
                    id: expect.any(Number),
                    value: expect.any(Object),
                });
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                const result_1 = __disposeResources(env_1);
                if (result_1)
                    await result_1;
            }
        });
    });
    describe("createProduct", () => {
        it("should create product with attributes", async () => {
            const env_2 = { stack: [], error: void 0, hasError: false };
            try {
                const p = __addDisposableResource(env_2, await createProducts(), true);
                const fix = await fixture(p.db.pool);
                const product = await p.products.createProduct({
                    attributes: fix.attributeValues,
                    categoryId: fix.catId,
                    price: 100,
                    name: { uk: "test", en: "test", ru: "test" },
                });
                expect(product).toMatchSnapshot({
                    id: expect.any(Number),
                });
            }
            catch (e_2) {
                env_2.error = e_2;
                env_2.hasError = true;
            }
            finally {
                const result_2 = __disposeResources(env_2);
                if (result_2)
                    await result_2;
            }
        });
        it("should create product without attributes", async () => {
            const env_3 = { stack: [], error: void 0, hasError: false };
            try {
                const p = __addDisposableResource(env_3, await createProducts(), true);
                const fix = await fixture(p.db.pool);
                const product = await p.products.createProduct({
                    // attributes: fix.attributeValues,
                    categoryId: fix.catId,
                    price: 100,
                    name: { uk: "test", en: "test", ru: "test" },
                });
                expect(product).toEqual({
                    id: expect.any(Number),
                });
            }
            catch (e_3) {
                env_3.error = e_3;
                env_3.hasError = true;
            }
            finally {
                const result_3 = __disposeResources(env_3);
                if (result_3)
                    await result_3;
            }
        });
        it("should create products with empty attributes", async () => {
            const env_4 = { stack: [], error: void 0, hasError: false };
            try {
                const p = __addDisposableResource(env_4, await createProducts(), true);
                const fix = await fixture(p.db.pool);
                const product = await p.products.createProduct({
                    attributes: [],
                    categoryId: fix.catId,
                    price: 100,
                    name: { uk: "test", en: "test", ru: "test" },
                });
                expect(product).toEqual({
                    id: expect.any(Number),
                });
            }
            catch (e_4) {
                env_4.error = e_4;
                env_4.hasError = true;
            }
            finally {
                const result_4 = __disposeResources(env_4);
                if (result_4)
                    await result_4;
            }
        });
    });
    describe("updateProduct", () => {
        it("should update update attributes", async () => {
            const env_5 = { stack: [], error: void 0, hasError: false };
            try {
                const p = __addDisposableResource(env_5, await createProducts(), true);
                const fix = await fixture(p.db.pool);
                async function getProduct() {
                    const product = await p.products.findOneProduct({
                        id: fix.product.id,
                    });
                    return product;
                }
                // decrease attribute count
                await expect(p.products.updateProduct(fix.product.id, {
                    attributes: [fix.attributeValues[0]],
                })).resolves.not.toThrow();
                expect(await getProduct().then((r) => r?.attributes)).toHaveLength(1);
                // get back the same
                await expect(p.products.updateProduct(fix.product.id, {
                    attributes: fix.attributeValues,
                })).resolves.not.toThrow();
                expect(await getProduct().then((r) => r?.attributes)).toHaveLength(2);
                // set attributes to 0
                await expect(p.products.updateProduct(fix.product.id, {
                    attributes: [],
                })).resolves.not.toThrow();
                expect(await getProduct().then((r) => r?.attributes)).toHaveLength(0);
            }
            catch (e_5) {
                env_5.error = e_5;
                env_5.hasError = true;
            }
            finally {
                const result_5 = __disposeResources(env_5);
                if (result_5)
                    await result_5;
            }
        });
    });
    describe("deleteProduct", () => {
        it("should delete product", async () => {
            const env_6 = { stack: [], error: void 0, hasError: false };
            try {
                const p = __addDisposableResource(env_6, await createProducts(), true);
                const fix = await fixture(p.db.pool);
                await expect(p.products.deleteProduct({
                    id: fix.product.id,
                })).resolves.toBe(fix.product.id);
            }
            catch (e_6) {
                env_6.error = e_6;
                env_6.hasError = true;
            }
            finally {
                const result_6 = __disposeResources(env_6);
                if (result_6)
                    await result_6;
            }
        });
        it("should not delete product", async () => {
            const env_7 = { stack: [], error: void 0, hasError: false };
            try {
                const p = __addDisposableResource(env_7, await createProducts(), true);
                await expect(p.products.deleteProduct({
                    id: 1000000000,
                })).resolves.toBeUndefined();
            }
            catch (e_7) {
                env_7.error = e_7;
                env_7.hasError = true;
            }
            finally {
                const result_7 = __disposeResources(env_7);
                if (result_7)
                    await result_7;
            }
        });
    });
});
//# sourceMappingURL=product.spec.js.map