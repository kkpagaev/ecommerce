export declare function filterUpsertEntries<T extends {
    id: any;
}, ID extends T extends {
    id: infer I;
} ? I : never = T extends {
    id: infer I;
} ? I : never, A extends Partial<T> = Partial<T>>(input: A[], old: T[]): {
    toDelete: Array<ID>;
    toUpsert: A[];
};
//# sourceMappingURL=utils.d.ts.map