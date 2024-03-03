import { describe, expect, it } from "vitest";
import { filterUpsertEntries } from "../src/utils";
describe("utils", () => {
    describe("filterUpsertEntries", () => {
        it("should filter entries that not in first argument as to delete", () => {
            const res = filterUpsertEntries([{
                    id: 1,
                    value: "any",
                }], [
                {
                    id: 1,
                },
                {
                    id: 2,
                },
            ]);
            expect(res.toDelete).toEqual([2]);
            expect(res.toUpsert).toEqual([{
                    id: 1,
                    value: "any",
                }]);
        });
        it("should add entries without id to toUpsert", () => {
            const res = filterUpsertEntries([
                {
                    value: "any",
                },
            ], []);
            expect(res.toDelete).toEqual([]);
            expect(res.toUpsert).toEqual([
                {
                    value: "any",
                },
            ]);
        });
        it("should toDelete all entries if input is empty", () => {
            const res = filterUpsertEntries([], [
                {
                    id: 1,
                    value: "any",
                },
                {
                    id: 2,
                    value: "any",
                },
            ]);
            expect(res.toUpsert).toEqual([]);
            expect(res.toDelete).toEqual([1, 2]);
        });
    });
});
//# sourceMappingURL=utils.spec.js.map