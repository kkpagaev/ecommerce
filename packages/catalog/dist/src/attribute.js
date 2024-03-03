import { catalogQueries as q } from "./queries";
import { filterUpsertEntries } from "./utils";
import { tx } from "@repo/pool";
export function Attributes(f) {
    return {
        upsertAttributeValue: upsertAttributeValue.bind(null, f.pool),
        createAttribute: createAttribute.bind(null, f.pool),
        updateAttribute: updateAttribute.bind(null, f.pool),
        findAttributeById: findAttributeById.bind(null, f.pool),
        findOneAttribute: findOneAttribute.bind(null, f.pool),
    };
}
export async function createAttribute(pool, input) {
    return tx(pool, async (client) => {
        const att = await q.attribute.create.run({
            values: [{
                    name: input.name,
                    description: input.description,
                }],
        }, pool).then((r) => r[0]);
        if (input.values) {
            await upsertAttributeValueTransaction(client, att.id, input.values.map((v) => ({
                value: v.value,
                attributeId: att.id,
            })));
        }
        return att;
    });
}
export async function updateAttribute(pool, id, input) {
    return tx(pool, async (client) => {
        const res = await q.attribute.update.run({
            name: input.name,
            description: input.description,
            id,
        }, pool);
        if (input.values) {
            await upsertAttributeValueTransaction(client, id, input.values);
        }
        return res;
    });
}
export async function createAttributeValue(pool, input) {
    return q.attributeValue.create.run({
        values: input,
    }, pool);
}
export async function upsertAttributeValue(pool, attributeId, input) {
    return tx(pool, async (client) => {
        await upsertAttributeValueTransaction(client, attributeId, input);
    });
}
export async function upsertAttributeValueTransaction(client, attributeId, input) {
    const { toDelete, toUpsert } = filterUpsertEntries(input, await q.attributeValue.idList.run({
        attributeId: attributeId,
    }, client));
    if (toDelete.length > 0) {
        await q.attributeValue.deleteMany.run({
            ids: toDelete,
        }, client);
    }
    if (toUpsert.length > 0) {
        await q.attributeValue.upsert.run({
            values: toUpsert.map((i) => ({
                id: i.id,
                value: i.value,
                attributeId: attributeId,
            })),
        }, client);
    }
}
export async function findAttributeById(pool, id) {
    const res = await q.attribute.findById.run({ id }, pool);
    return res;
}
export async function findOneAttribute(pool, props) {
    const attribute = await q.attribute.findOne.run({
        id: props.id,
    }, pool).then((res) => res[0]);
    const values = await q.attributeValue.list.run({
        attribute_id: attribute.id,
    }, pool);
    return {
        ...attribute,
        values,
    };
}
//# sourceMappingURL=attribute.js.map