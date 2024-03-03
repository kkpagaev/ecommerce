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
import { Categories } from "../src/category";
import { testDB } from "./utils";
async function categories() {
    const db = await testDB();
    const category = Categories({ pool: db.pool });
    return {
        category,
        [Symbol.asyncDispose]: db[Symbol.asyncDispose],
    };
}
describe("category", () => {
    it("create category", async () => {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const service = __addDisposableResource(env_1, await categories(), true);
            const category = await service.category.createCategory({
                name: {
                    uk: "test",
                    ru: "test",
                    en: "test",
                },
                description: {
                    uk: "test",
                    ru: "test",
                    en: "test",
                },
            });
            expect(category).toHaveProperty("id");
            const id = category.id;
            const category2 = await service.category.findCategoryById(id);
            expect(category2).toEqual({
                id,
                name: {
                    uk: "test",
                    ru: "test",
                    en: "test",
                },
                slug: "test",
                description: {
                    uk: "test",
                    ru: "test",
                    en: "test",
                },
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
    it("create category with cyrillic name", async () => {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const service = __addDisposableResource(env_2, await categories(), true);
            const category = await service.category.createCategory({
                name: {
                    uk: "тест",
                    ru: "test",
                    en: "test",
                },
                description: {
                    uk: "тест опис",
                    ru: "test",
                    en: "test",
                },
            });
            expect(category).toHaveProperty("id");
            const id = category.id;
            const category2 = await service.category.findCategoryById(id);
            expect(category2).toEqual({
                id,
                name: {
                    uk: "тест",
                    ru: "test",
                    en: "test",
                },
                slug: "test",
                description: {
                    uk: "тест опис",
                    ru: "test",
                    en: "test",
                },
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
});
//# sourceMappingURL=category.spec.js.map