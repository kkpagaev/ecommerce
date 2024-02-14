/** Types generated for queries found in "src/core/catalog/query/i18n.sql" */
import { PreparedQuery } from "@pgtyped/runtime";

export type locale = "en" | "ru" | "uk";

/** 'CreateTranslationQuery' parameters type */
export interface ICreateTranslationQueryParams {
  translations: readonly ({
    id: string | null | void;
    locale: locale | null | void;
    value: string | null | void;
  })[];
}

/** 'CreateTranslationQuery' return type */
export interface ICreateTranslationQueryResult {
  id: string;
  locale: locale;
  value: string;
}

/** 'CreateTranslationQuery' query type */
export interface ICreateTranslationQueryQuery {
  params: ICreateTranslationQueryParams;
  result: ICreateTranslationQueryResult;
}

const createTranslationQueryIR: any = { usedParamSet: { translations: true }, params: [{ name: "translations", required: false, transform: { type: "pick_array_spread", keys: [{ name: "id", required: false }, { name: "locale", required: false }, { name: "value", required: false }] }, locs: [{ a: 51, b: 63 }] }], statement: "INSERT INTO translation (id, locale, value)\nVALUES :translations\nRETURNING *" };

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO translation (id, locale, value)
 * VALUES :translations
 * RETURNING *
 * ```
 */
export const createTranslationQuery = new PreparedQuery<ICreateTranslationQueryParams, ICreateTranslationQueryResult>(createTranslationQueryIR);
