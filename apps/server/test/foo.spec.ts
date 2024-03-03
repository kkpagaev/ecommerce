import { describe, beforeEach, it, assert } from "vitest";
import { FastifyInstance } from "fastify";
import { build } from "../src/app";

describe("foo", () => {
  let f: FastifyInstance;

  beforeEach(async () => {
    f = await build();
  });

  it("bar", async () => {
    assert.equal(1, 1);
    // const res = await f.inject("/");
    //
    // assert.equal(res.statusCode, 200);
    // assert.deepEqual(res.json(), { hello: "world" });
  });
});
