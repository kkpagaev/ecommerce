import { ErrorMessage } from "@hookform/error-message";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";

type LocationCreateInputs =
  AdminInputs["inventory"]["location"]["createLocation"];

type LocationUpdateInputs = Omit<
  AdminInputs["inventory"]["location"]["updateLocation"],
  "id"
>;

type LocationModel = AdminOutputs["inventory"]["location"]["findOneLocation"];

type LocationFormProps = {
  errorMessage?: string;
  values?: LocationModel;
} & (
  | {
      edit?: false | undefined;
      onSubmit: (data: LocationCreateInputs) => void;
    }
  | {
      edit: true;
      onSubmit: (data: LocationUpdateInputs) => void;
    }
);

export function LocationForm({
  onSubmit,
  errorMessage,
  values,
}: LocationFormProps) {
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
