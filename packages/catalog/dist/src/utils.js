export function filterUpsertEntries(input, old) {
    // should use groupBy, but only in node21 or install lodash
    return old.reduce((acc, att) => {
        const found = input.find((i) => i.id === att.id);
        if (!found) {
            acc.toDelete.push(att.id);
        }
        else {
            acc.toUpsert.push(found);
        }
        return acc;
    }, {
        toDelete: [],
        toUpsert: input.filter((i) => i.id === undefined),
    });
}
//# sourceMappingURL=utils.js.map