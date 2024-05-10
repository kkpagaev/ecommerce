// eslint-disable-next-line no-unused-vars
import { Pool } from "pg";
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
    email = COALESCE($email, email)
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
  SELECT * FROM admins a
  WHERE a.email LIKE COALESCE(CONCAT('%', $email::text, '%'), a.email)
  AND a.name LIKE COALESCE(CONCAT('%', $name::text, '%'), a.email)
  ORDER BY id
`;

/**
 * @type {TaggedQuery<
 *   import("./queries/index.types").IAdminCreateQueryQuery
 * >}
 */
export const adminCreateQuery = sql`
  INSERT INTO admins (email, name, surname)
  VALUES (
    $email!,
    $name,
    $surname
  )
  RETURNING id
`;

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
   * }} CreateAdmin
   */
  /** @param {CreateAdmin} input */
  async createAdmin(input) {
    return await adminCreateQuery
      .run(
        {
          name: input.name,
          surname: input.surname,
          email: input.email,
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
    return await adminUpdateQuery
      .run(
        {
          id: id,
          name: input.name,
          surname: input.surname,
          email: input.email,
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
   *   email?: string;
   *   name?: string;
   * }} ListAdmins
   */
  /** @param {ListAdmins} input */
  async listAdmins(input) {
    const admins = await adminListQuery.run(
      {
        name: input.name,
        email: input.email,
      },
      this.pool,
    );

    return admins;
  }
}
