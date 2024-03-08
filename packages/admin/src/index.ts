import { Pool } from "pg";
import * as bcrypt from "bcrypt";
import { sql } from "@pgtyped/runtime";
import {
  IAdminCreateQueryQuery,
  IAdminUpdateQueryQuery,
  IAdminFindOneQueryQuery,
  IAdminListQueryQuery,
  IAdminListCountQueryQuery,
  IAdminDeleteQueryQuery,
} from "./index.types";

export type Admins = ReturnType<typeof Admins>;
export function Admins(f: { pool: Pool }) {
  return {
    listAdmins: listAdmins.bind(null, f.pool),
    findOneAdmin: getOneAdmin.bind(null, f.pool),
    createAdmin: createAdmin.bind(null, f.pool),
    updateAdmin: updateAdmin.bind(null, f.pool),
  };
}

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export const adminCreateQuery = sql<IAdminCreateQueryQuery>`
  INSERT INTO admins (email, password, name, surname)
  VALUES (
    $email!,
    $password!,
    $name,
    $surname
  )
  RETURNING id
`;

type CreateAdmin = {
  name?: string;
  surname?: string;
  email: string;
  password: string;
};
export async function createAdmin(pool: Pool, input: CreateAdmin) {
  const hashedPassword = await hashPassword(input.password);
  return await adminCreateQuery
    .run(
      {
        name: input.name,
        surname: input.surname,
        email: input.email,
        password: hashedPassword,
      },
      pool,
    )
    .then((res) => res[0]);
}

const adminUpdateQuery = sql<IAdminUpdateQueryQuery>`
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

type UpdateAdmin = Partial<CreateAdmin>;
export async function updateAdmin(pool: Pool, id: number, input: UpdateAdmin) {
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
      pool,
    )
    .then((res) => res[0]);
}

const adminFindOneQuery = sql<IAdminFindOneQueryQuery>`
  SELECT * FROM admins
  WHERE id = COALESCE($id, id)
  AND email = COALESCE($email, email)
`;

type GetOneAdmin = {
  id?: number;
  email?: string;
};
export async function getOneAdmin(pool: Pool, input: GetOneAdmin) {
  const admin = await adminFindOneQuery
    .run(
      {
        id: input.id,
        email: input.email,
      },
      pool,
    )
    .then((res) => res[0]);
  if (!admin) {
    return null;
  }
  return admin;
}

const adminDeleteQuery = sql<IAdminDeleteQueryQuery>`
  DELETE FROM admins
  WHERE id = $id!
`;

export async function deleteAdmin(pool: Pool, id: number) {
  return await adminDeleteQuery.run(
    {
      id: id,
    },
    pool,
  );
}

const adminListQuery = sql<IAdminListQueryQuery>`
  SELECT * FROM admins
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;
export const adminListCountQuery = sql<IAdminListCountQueryQuery>`
  SELECT COUNT(*) FROM admins;
`;
type ListAdmins = {
  limit?: number;
  page?: number;
};
export async function listAdmins(pool: Pool, input: ListAdmins) {
  const admins = await adminListQuery.run(
    {
      limit: input.limit,
      page: input.page,
    },
    pool,
  );

  const count = await adminListCountQuery
    .run(undefined, pool)
    .then((res) => +(res[0]?.count ?? 0));

  return {
    data: admins,
    count: count,
  };
}
