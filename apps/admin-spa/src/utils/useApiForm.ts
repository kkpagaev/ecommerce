import { useEffect } from "react";
import { FieldValues, UseFormProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodError } from "zod";
import { parseErrorSchema } from "./resolver";

export function useApiForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext extends object = object,
>(
  baseProps?: UseFormProps<TFieldValues, TContext> & {
    errorMessage?: string;
  },
) {
  const { errorMessage, ...props } = baseProps || {};
  const form = useForm<TFieldValues>({
    ...props,
    shouldFocusError: false,
  });
  const { setError, clearErrors } = form;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error("Form validation error");
    clearErrors();
    const errors = parseErrorSchema(
      new ZodError(JSON.parse(errorMessage)).errors,
      false,
    );
    for (const [path, error] of Object.entries(errors)) {
      type Path = Parameters<typeof setError>[0];

      setError(path as Path, {
        type: error.type,
        message: error.message,
      });
    }
  }, [errorMessage, clearErrors, setError]);

  return form;
}
