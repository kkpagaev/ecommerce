import { sql } from "@pgtyped/runtime";
import { IAdminListCountQueryQuery, IAdminListQueryQuery, IAdminDeleteQueryQuery, IAdminFindOneQueryQuery, IAdminUpdateQueryQuery, IAdminCreateQueryQuery } from "./queries.types";

// | Column     | Type                        | Modifiers                                           |
// |------------|-----------------------------|-----------------------------------------------------|
// | id         | integer                     |  not null default nextval('admin_id_seq'::regclass) |
// | name       | character varying(255)      |                                                     |
// | surname    | character varying(255)      |                                                     |
// | password   | character varying(255)      |  not null                                           |
// | email      | character varying(255)      |  not null                                           |
// | created_at | timestamp without time zone |  not null default CURRENT_TIMESTAMP                 |

export const adminCreateQuery = sql<IAdminCreateQueryQuery>`
  INSERT INTO admin (email, password, name, surname)
  VALUES (
    $email!,
    $password!,
    $name,
    $surname
  )
  RETURNING id
`;

export const adminUpdateQuery = sql<IAdminUpdateQueryQuery>`
  UPDATE admin
  SET
    name = COALESCE($name, name),
    surname = COALESCE($surname, surname),
    email = COALESCE($email, email),
    password = COALESCE($password, password)
  WHERE
    id = $id!
  RETURNING id
`;

export const adminFindOneQuery = sql<IAdminFindOneQueryQuery>`
  SELECT * FROM admin
  WHERE id = COALESCE($id, id)
  AND email = COALESCE($email, email)
`;

export const adminDeleteQuery = sql<IAdminDeleteQueryQuery>`
  DELETE FROM admin
  WHERE id = $id!
`;

export const adminListQuery = sql<IAdminListQueryQuery>`
  SELECT * FROM admin
  LIMIT COALESCE($limit, 10)
  OFFSET (COALESCE($page, 1) - 1) * COALESCE($limit, 10);
`;

export const adminListCountQuery = sql<IAdminListCountQueryQuery>`
  SELECT COUNT(*) FROM admin;
`;

export const adminQueries = {
  admin: {
    listCount: adminListCountQuery,
    list: adminListQuery,
    delete: adminDeleteQuery,
    findOne: adminFindOneQuery,
    update: adminUpdateQuery,
    create: adminCreateQuery,
  },
};
