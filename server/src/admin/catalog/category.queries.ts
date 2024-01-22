/** Types generated for queries found in "src/admin/catalog/category.sql" */
import { PreparedQuery } from "@pgtyped/runtime";

/** 'FindCategoryById' parameters type */
export interface IFindCategoryByIdParams {
  id?: number | null | void;
}

/** 'FindCategoryById' return type */
export interface IFindCategoryByIdResult {
  id: number;
}

/** 'FindCategoryById' query type */
export interface IFindCategoryByIdQuery {
  params: IFindCategoryByIdParams;
  result: IFindCategoryByIdResult;
}

const findCategoryByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: "id",
      required: false,
      transform: { type: "scalar" },
      locs: [{ a: 37, b: 39 }],
    },
  ],
  statement: "SELECT id FROM categories\nWHERE id = :id",
};

/**
 * Query generated from SQL:
 * ```
 * SELECT id FROM categories
 * WHERE id = :id
 * ```
 */
export const findCategoryById = new PreparedQuery<
  IFindCategoryByIdParams,
  IFindCategoryByIdResult
>(findCategoryByIdIR);
