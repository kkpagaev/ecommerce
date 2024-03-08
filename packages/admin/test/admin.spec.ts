import { describe, it, expect } from "vitest";
import { testDB } from "@repo/test-utils";
import { Admins } from "../src";

async function usingAdmins() {
  const db = await testDB(
    process.env.DATABASE_URL || "postgresql://user:user@localhost:1252/user",
  );
  const admins = new Admins({ pool: db.pool });

  return {
    db,
    admins,
    [Symbol.asyncDispose]: db[Symbol.asyncDispose],
  };
}

describe("admin", () => {
  it("should create new admin", async () => {
    await using a = await usingAdmins();
    const createA = await a.admins.createAdmin({
      email: "email@test.com",
      name: "name",
      password: "password",
      surname: "surname",
    });

    expect(createA.id).toBeTypeOf("number");
    const admin = await a.admins.findOneAdmin({
      email: "email@test.com",
    });
    expect(admin).not.toBe(null);

    expect(admin?.email).toBe("email@test.com");
    expect(admin?.password).not.toBe("password");
  });

  it("should update admin", async () => {
    await using a = await usingAdmins();
    const createA = await a.admins.createAdmin({
      email: "email@test.com",
      name: "name",
      password: "password",
      surname: "surname",
    });
    const oldAdmin = await a.admins.findOneAdmin({
      id: createA.id,
    });
    await a.admins.updateAdmin(createA.id, {
      password: "newPassword",
    });

    const updatedAdmin = await a.admins.findOneAdmin({
      id: createA.id,
    });

    expect(updatedAdmin?.password).not.toBe(oldAdmin?.password);
  });
});
