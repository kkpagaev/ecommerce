// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";
import * as bcrypt from "bcrypt";
// eslint-disable-next-line no-unused-vars
import { TaggedQuery, sql } from "@pgtyped/runtime";

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").IAdminUpdateQueryQuery
 * >}
 */
const adminUpdateQuery = sql`
  UPDATE admins
  SET
    name = COALESCE($name, name),
    surname = COALESCE($surname, surname),
    email = COALESCE($email, email),
    password = COALESCE($password, password)
  WHERE
    id = $id!
  RETURNING id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").IAdminFindOneQueryQuery
 * >}
 */
const adminFindOneQuery = sql`
  SELECT * FROM admins
  WHERE id = COALESCE($id, id)
  AND email = COALESCE($email, email)
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").IAdminListCountQueryQuery
 * >}
 */
export const adminListCountQuery = sql`
  SELECT COUNT(*) FROM admins;
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").IAdminDeleteQueryQuery
 * >}
 */
const adminDeleteQuery = sql`
  DELETE FROM admins
  WHERE id = $id!
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").IAdminListQueryQuery
 * >}
 */
const adminListQuery = sql`
  SELECT * FROM admins
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").IAdminCreateQueryQuery
 * >}
 */
export const adminCreateQuery = sql`
  INSERT INTO admins (email, password, name, surname)
  VALUES (
    $email!,
    $password!,
    $name,
    $surname
  )
  RETURNING id
`;

/** @param {string} password */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export class Admins {
  /** @param {{ pool: Pool }} f */
  constructor(f) {
    this.pool = f.pool;
  }

  /**
   * @typedef {{
   *   name?: string;
   *   surname?: string;
   *   email: string;
   *   password: string;
   * }} CreateAdmin
   */
  /** @param {CreateAdmin} input */
  async createAdmin(input) {
    const hashedPassword = await hashPassword(input.password);
    return await adminCreateQuery
      .run(
        {
          name: input.name,
          surname: input.surname,
          email: input.email,
          password: hashedPassword,
        },
        this.pool,
      )
      .then((res) => res[0]);
  }

  /** @typedef {Partial<CreateAdmin>} UpdateAdmin */
  /**
   * @param {number} id
   * @param {UpdateAdmin} input
   */
  async updateAdmin(id, input) {
    const hashedPassword = input.password
      ? await hashPassword(input.password)
      : undefined;

    return await adminUpdateQuery
      .run(
        {
          id: id,
          name: input.name,
          surname: input.surname,
          email: input.email,
          password: hashedPassword,
        },
        this.pool,
      )
      .then((res) => res[0]);
  }

  /**
   * @typedef {{
   *   id?: number;
   *   email?: string;
   * }} GetOneAdmin
   */
  /** @param {GetOneAdmin} input */
  async findOneAdmin(input) {
    const admin = await adminFindOneQuery
      .run(
        {
          id: input.id,
          email: input.email,
        },
        this.pool,
      )
      .then((res) => res[0]);
    if (!admin) {
      return null;
    }
    return admin;
  }

  /** @param {number} id */
  async deleteAdmin(id) {
    return await adminDeleteQuery.run(
      {
        id: id,
      },
      this.pool,
    );
  }

  /**
   * @typedef {{
   *   limit?: number;
   *   page?: number;
   * }} ListAdmins
   */
  /** @param {ListAdmins} input */
  async listAdmins(input) {
    const admins = await adminListQuery.run(
      {
        limit: input.limit,
        page: input.page,
      },
      this.pool,
    );

    const count = await adminListCountQuery
      .run(undefined, this.pool)
      .then((res) => +(res[0]?.count ?? 0));

    return {
      data: admins,
      count: count,
    };
  }
}
