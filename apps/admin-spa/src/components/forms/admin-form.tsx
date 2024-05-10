import { ErrorMessage } from "@hookform/error-message";
import { AdminInputs, AdminOutputs } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiForm } from "@/utils/useApiForm";
import { Label } from "@/components/ui/label";

type AdminCreateInputs = AdminInputs["admin"]["createAdmin"];

type AdminUpdateInputs = Omit<AdminInputs["admin"]["updateAdmin"], "id">;

type AdminModel = Exclude<AdminOutputs["admin"]["findOneAdmin"], null>;

type AdminFormProps = {
  errorMessage?: string;
  values?: AdminModel;
} & (
  | {
      edit?: false | undefined;
      onSubmit: (data: AdminCreateInputs) => void;
    }
  | {
      edit: true;
      onSubmit: (data: AdminUpdateInputs) => void;
    }
);

export function AdminForm({ onSubmit, errorMessage, values }: AdminFormProps) {
  const {
    handleSubmit,
    clearErrors,
    register,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: values && {
      email: values.email,
      name: values.name,
      surname: values.surname,
    },
    defaultValues: {
      email: "",
      name: "",
      surname: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        clearErrors();
        onSubmit({
          surname: data.surname || undefined,
          name: data.name || undefined,
          email: data.email,
        });
      })}
      className="flex flex-col gap-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input {...register("name")} placeholder="name" />
            <ErrorMessage errors={errors} name={"name"} />
          </div>
          <div>
            <Label htmlFor="surname">Surnamme</Label>
            <Input {...register("surname")} placeholder="surname" />
            <ErrorMessage errors={errors} name={"surname"} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} placeholder="email" />
            <ErrorMessage errors={errors} name={"email"} />
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
