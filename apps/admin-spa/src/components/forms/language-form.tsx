import { ErrorMessage } from "@hookform/error-message";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";
import { AppRouter } from "@repo/server";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;
type AdminOutputs = RouterOutputs["admin"];
type AdminInputs = RouterInputs["admin"];

type LanguageCreateInputs = AdminInputs["language"]["create"];

type LanguageUpdateInputs = Omit<AdminInputs["language"]["update"], "id">;

type LanguageModel = AdminOutputs["language"]["list"][number];

type LanguageFormProps = {
  errorMessage?: string;
  values?: LanguageModel;
} & (
    | {
      edit?: false | undefined;
      onSubmit: (data: LanguageCreateInputs) => void;
    }
    | {
      edit: true;
      onSubmit: (data: LanguageUpdateInputs) => void;
    }
  );

export function LanguageForm({
  onSubmit,
  errorMessage,
  values,
}: LanguageFormProps) {
  const {
    handleSubmit,
    clearErrors,
    register,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: values && {
      name: values.name,
    },
    defaultValues: {
      name: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        clearErrors();
        onSubmit(data);
      })}
      className="flex flex-col gap-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Input {...register("name")} defaultValue={values?.name} />
            <ErrorMessage errors={errors} name={"name"} />
          </div>
        </CardContent>
      </Card>

      <div>
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
