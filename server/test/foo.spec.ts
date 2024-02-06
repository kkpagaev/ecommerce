import {describe, test, it, before} from "node:test";
import assert from "node:assert";

test("foo", (t) => {
  t.test("bar", () => {
    assert(true);
  })
})
