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
import { Attributes } from "../../src/attribute";
import { testDB } from "../utils";
async function createAttributes() {
    const db = await testDB();
    const attributes = Attributes({ pool: db.pool });
    return {
        attributes,
        db,
        [Symbol.asyncDispose]: db[Symbol.asyncDispose],
    };
}
function allAttributes(pool, attrId) {
    return q.attributeValue.list.run({
        attribute_id: attrId,
    }, pool);
}
describe("Attributes", () => {
    it("should create attribute", async () => {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const a = __addDisposableResource(env_1, await createAttributes(), true);
            const res = await a.attributes.createAttribute({
                name: { uk: "test", en: "test", ru: "test" },
            });
            expect(res).toEqual({
                id: expect.any(Number),
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
    it("should create with values", async () => {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const a = __addDisposableResource(env_2, await createAttributes(), true);
            const attribute = await a.attributes.createAttribute({
                name: { uk: "test", en: "test", ru: "test" },
                values: [{
                        value: { uk: "should create with values", en: "value", ru: "value" },
                    }],
            });
            {
                const vals = await allAttributes(a.db.pool, attribute.id);
                expect(vals).toHaveLength(1);
                expect(vals[0].value).toEqual({ uk: "should create with values", en: "value", ru: "value" });
            }
            expect(attribute).toEqual({
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
});
describe("AttributeValues", () => {
    async function fixture(pool) {
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
        return { attributes, attributeValues };
    }
    describe("upsertAttributeValue", () => {
        it("delete old values and insert new", async () => {
            const env_3 = { stack: [], error: void 0, hasError: false };
            try {
                const a = __addDisposableResource(env_3, await createAttributes(), true);
                const fix = await fixture(a.db.pool);
                await a.attributes.upsertAttributeValue(fix.attributes[0], [{
                        value: { uk: "new", en: "new", ru: "new" },
                        attributeId: fix.attributes[0],
                    }, {
                        value: { uk: "new2", en: "new2", ru: "new2" },
                        attributeId: fix.attributes[0],
                    }]);
                {
                    const res = await allAttributes(a.db.pool, fix.attributes[0]);
                    expect(res).toHaveLength(2);
                    expect(res.map((r) => r.id)).not.include(fix.attributeValues[0]);
                    expect(res[0].value).toEqual({ uk: "new", en: "new", ru: "new" });
                    expect(res[1].value).toEqual({ uk: "new2", en: "new2", ru: "new2" });
                }
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
        it("should update old value", async () => {
            const env_4 = { stack: [], error: void 0, hasError: false };
            try {
                const a = __addDisposableResource(env_4, await createAttributes(), true);
                const fix = await fixture(a.db.pool);
                await a.attributes.upsertAttributeValue(fix.attributes[0], [{
                        id: fix.attributeValues[0],
                        value: { uk: "new", en: "new", ru: "new" },
                        attributeId: fix.attributes[0],
                    }]);
                {
                    const res = await allAttributes(a.db.pool, fix.attributes[0]);
                    expect(res).toHaveLength(1);
                    expect(res[0].id).toEqual(fix.attributeValues[0]);
                    expect(res[0].value).toEqual({ uk: "new", en: "new", ru: "new" });
                }
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
});
//# sourceMappingURL=attribute.spec.js.map