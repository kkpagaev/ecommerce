// @deprecated
export function filterUpsertEntries<
  T extends { id: any },
  ID extends T extends { id: infer I } ? I : never = T extends { id: infer I } ? I : never,
  A extends Partial<T> = Partial<T>,
>(input: A[], old: T[]) {
  // should use groupBy, but only in node21 or install lodash
  return old.reduce<{
    toDelete: Array<ID>;
    toUpsert: A[];
  }>((acc, att) => {
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
