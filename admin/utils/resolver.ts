import { appendErrors, FieldError, FieldErrors } from "react-hook-form";
import { z, ZodError } from "zod";
import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import { FieldValues, ResolverResult, ResolverOptions } from "react-hook-form";
import { adminApi } from "./trpc";

// TConfig extends AnyRootConfig,
// TProcedure extends AnyProcedure,
export type Resolver = (
  route: { mutate: (props: any) => Promise<any> },
  factoryOptions?: {
    mode?: "async" | "sync";
    raw?: boolean;
  },
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>,
) => Promise<ResolverResult<TFieldValues>>;

const isZodError = (error: any): error is ZodError => error.errors != null;

const parseErrorSchema = (
  zodErrors: z.ZodIssue[],
  validateAllFieldCriteria: boolean,
) => {
  const errors: Record<string, FieldError> = {};
  for (; zodErrors.length; ) {
    const error = zodErrors[0];
    const { code, message, path } = error;
    const _path = path.join(".");

    if (!errors[_path]) {
      if ("unionErrors" in error) {
        const unionError = error.unionErrors[0].errors[0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
        };
      } else {
        errors[_path] = { message, type: code };
      }
    }

    if ("unionErrors" in error) {
      error.unionErrors.forEach((unionError) =>
        unionError.errors.forEach((e) => zodErrors.push(e)),
      );
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types;
      const messages = types && types[error.code];

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages
          ? ([] as string[]).concat(messages as string[], error.message)
          : error.message,
      ) as FieldError;
    }

    zodErrors.shift();
  }

  return errors;
};

export type CreateCategory = Parameters<
  typeof adminApi.catalog.category.createCategory.mutate
>[0];

export async function validateCategory(
  validationRoute: { mutate: (props: any) => Promise<any> },
  props: CreateCategory,
) {
  const validateRes = await validationRoute.mutate(props);

  if (validateRes[0].success) {
    return true;
  }

  const error = validateRes[0].error;

  console.log({ error: error });
  if (error.name !== "ZodError") {
    throw error;
  }
  return error.issues;
}

export const apiResolver: Resolver =
  (validationRoute, schemaOptions, resolverOptions = {}) =>
  async (values, _, options) => {
    try {
      const res = await validateCategory(validationRoute, values as any);
      if (res !== true) {
        throw new ZodError(res);
      }

      options.shouldUseNativeValidation && validateFieldsNatively({}, options);

      return {
        errors: {} as FieldErrors,
        values: values,
      };
    } catch (error: any) {
      if (isZodError(error)) {
        return {
          values: {},
          errors: toNestErrors(
            parseErrorSchema(
              error.errors,
              !options.shouldUseNativeValidation &&
                options.criteriaMode === "all",
            ),
            options,
          ),
        };
      }

      throw error;
    }
  };
