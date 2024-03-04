import { describe, it, expect } from "vitest";
import { testDB } from "@repo/test-utils";
import { Locations } from "../src/location";

async function usingLocations() {
  const db = await testDB(process.env.DATABASE_URL || "postgresql://user:user@localhost:1252/user");
  const locations = Locations({ pool: db.pool });

  return {
    db,
    locations,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

describe("Location", () => {
  it("should create Location", async () => {
    await using l = await usingLocations();
    const result = await l.locations.createLocation({
      name: "tset",
    });

    expect(result?.id).toBeDefined();
    const inserted = await l.locations.findOneLocation({
      id: result?.id,
    });

    expect(inserted?.name).toBe("tset");
  });
});
