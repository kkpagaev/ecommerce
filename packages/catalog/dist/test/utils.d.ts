/// <reference types="node" />
import { Pool } from "pg";
export declare function testDB(): Promise<{
    pool: Pool;
    client: import("pg").PoolClient;
    [Symbol.asyncDispose](): Promise<void>;
}>;
//# sourceMappingURL=utils.d.ts.map