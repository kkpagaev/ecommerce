import { Pool } from "pg";
import { adminQueries as q } from "./queries";
import * as bcrypt from "bcrypt";

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

type CreateAdmin = {
  name?: string;
  surname?: string;
  email: string;
  password: string;
};
export async function createAdmin(pool: Pool, input: CreateAdmin) {
  const hashedPassword = await hashPassword(input.password);
  return await q.admin.create.run({
    name: input.name,
    surname: input.surname,
    email: input.email,
    password: hashedPassword,
  }, pool).then((res) => res[0]);
}

type UpdateAdmin = Partial<CreateAdmin>;
export async function updateAdmin(pool: Pool, id: number, input: UpdateAdmin) {
  const hashedPassword = input.password ? await hashPassword(input.password) : undefined;

  return await q.admin.update.run({
    id: id,
    name: input.name,
    surname: input.surname,
    email: input.email,
    password: hashedPassword,
  }, pool).then((res) => res[0]);
}

type GetOneAdmin = {
  id?: number;
  email?: string;
};
export async function getOneAdmin(pool: Pool, input: GetOneAdmin) {
  const admin = await q.admin.findOne.run({
    id: input.id,
    email: input.email,
  }, pool).then((res) => res[0]);
  if (!admin) {
    return null;
  }
  return admin;
}

export async function deleteAdmin(pool: Pool, id: number) {
  return await q.admin.delete.run({
    id: id,
  }, pool);
}

type ListAdmins = {
  limit?: number;
  page?: number;
};
export async function listAdmins(pool: Pool, input: ListAdmins) {
  const admins = await q.admin.list.run({
    limit: input.limit,
    page: input.page,
  }, pool);

  const count = await q.admin.listCount.run(undefined, pool)
    .then((res) => +(res[0].count ?? 0));

  return {
    data: admins,
    count: count,
  };
}
