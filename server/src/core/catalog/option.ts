import { Translation } from "./i18n";
import { Pool } from "pg";

export type Options = ReturnType<typeof Options>;

export function Options(f: { pool: Pool }) {
  return {
    createOption: createOption.bind(null, f.pool),
  };
}

type CreateOptionProps = {
  name: Translation;
  description?: Translation;
};
export async function createOption(pool: Pool, input: CreateOptionProps) {
  return null;
}
