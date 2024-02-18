import { Pool } from "pg";

export type Tags = ReturnType<typeof Tags>;
export function Tags(f: { pool: Pool }) {
  return {
    createTag: createTag.bind(null, f.pool),
    updateTag: updateTag.bind(null, f.pool),
  };
}

type CreateTagProps = {
  name: string;
};
async function createTag(pool: Pool, input: CreateTagProps) {
  return null;
}

type UpdateTagProps = {
  name: string;
};
async function updateTag(pool: Pool, id: number, input: UpdateTagProps) {
  return null;
}
