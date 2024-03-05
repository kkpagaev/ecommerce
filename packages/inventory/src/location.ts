import { sql } from "@pgtyped/runtime";
import { ILocationFindOneQueryQuery, ILocationDeleteQueryQuery, ILocationListQueryQuery, ILocationUpdateQueryQuery, ILocationCreateQueryQuery } from "./location.types";
import { Pool } from "pg";

export function Locations(f: { pool: Pool }) {
  return {
    findOneLocation: findOneLocation.bind(null, f.pool),
    deleteLocation: deleteLocation.bind(null, f.pool),
    listLocations: listLocations.bind(null, f.pool),
    createLocation: createLocation.bind(null, f.pool),
    updateLocation: updateLocation.bind(null, f.pool),
  };
}

export const locationCreateQuery = sql<ILocationCreateQueryQuery>`
  INSERT INTO locations (name) VALUES ($name!) RETURNING id;
`;

export type CreateLocationParams = {
  name: string;
};
export async function createLocation(pool: Pool, params: CreateLocationParams) {
  const result = await locationCreateQuery.run({
    name: params.name,
  }, pool).then((r) => r[0]);

  return result;
}

export const locationUpdateQuery = sql<ILocationUpdateQueryQuery>`
  UPDATE locations
  SET
      name = COALESCE($name, name)
  WHERE
      id = $id!;
`;

export type UpdateLocationParams = Partial<CreateLocationParams>;
export async function updateLocation(pool: Pool, id: number, params: UpdateLocationParams) {
  const result = await locationUpdateQuery.run({
    id: id,
    name: params.name,
  }, pool);

  return result;
}

export const locationListQuery = sql<ILocationListQueryQuery>`
  SELECT
      id,
      name
  FROM
      locations
  ORDER BY
      id
`;
export async function listLocations(pool: Pool) {
  const res = await locationListQuery.run(undefined, pool);

  return res;
}

export const locationDeleteQuery = sql<ILocationDeleteQueryQuery>`
  DELETE FROM locations
  WHERE id = $id!
`;
export async function deleteLocation(pool: Pool, id: number) {
  const result = await locationDeleteQuery.run({
    id: id,
  }, pool);

  return result;
}

export const locationFindOneQuery = sql<ILocationFindOneQueryQuery>`
  SELECT
      id,
      name
  FROM
      locations
  WHERE
    id = COALESCE($id, id)
    AND name = COALESCE($name, name)
  LIMIT 1;
`;
export type FindOneLocationParams = {
  id?: number;
  name?: string;
};
export async function findOneLocation(pool: Pool, params: FindOneLocationParams) {
  const res = await locationFindOneQuery.run(params, pool);
  return res[0];
}
