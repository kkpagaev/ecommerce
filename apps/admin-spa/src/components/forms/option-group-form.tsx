import { ErrorMessage } from "@hookform/error-message";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";

type OptionGroupCreateInputs =
  AdminInputs["catalog"]["optionGroups"]["createOptionGroup"];

type OptionGroupUpdateInputs = Omit<
  AdminInputs["catalog"]["optionGroups"]["updateOptionGroup"],
  "id" | "groupId"
>;

type LanguageModel = AdminOutputs["language"]["list"][number];
type OptionGroupModel = Exclude<
  AdminOutputs["catalog"]["optionGroups"]["findOptionGroup"],
  null
>;

type OptionGroupFormProps = {
  errorMessage?: string;
  languages: LanguageModel[];
  values?: OptionGroupModel;
} & (
  | {
      edit?: false | undefined;
      onSubmit: (data: OptionGroupCreateInputs) => void;
    }
  | {
      edit: true;
      onSubmit: (data: OptionGroupUpdateInputs) => void;
    }
);

export function OptionGroupForm({
  languages,
  onSubmit,
  errorMessage,
  values,
}: OptionGroupFormProps) {
  const formValues: OptionGroupCreateInputs | undefined = values && {
    type: values.type,
    descriptions: languages.map((lang) => {
      const old = values.descriptions.find((d) => d.language_id === lang.id);
      return {
        languageId: lang.id,
        name: old?.name || "",
        description: old?.description || "",
      };
    }),
  };
  const defaultValues: OptionGroupCreateInputs = {
    type: "size",
    descriptions: languages.map((lang) => {
      return {
        languageId: lang.id,
        name: "",
      };
    }),
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: formValues,
    defaultValues: defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: "descriptions",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        clearErrors();
        onSubmit(data);
      })}
      className="flex flex-col gap-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Translations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            {fields.map((field, index) => (
              <div key={index}>
                <CardTitle>
                  {languages.find((lang) => lang.id === field.languageId)?.name}
                </CardTitle>
                <div key={field.id} className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor={`descriptions.${index}.name`}>Name</Label>
                    <Input
                      {...register(`descriptions.${index}.name`)}
                      defaultValue={values?.descriptions[index]?.name}
                      placeholder="name"
                    />

                    <ErrorMessage
                      errors={errors}
                      name={`descriptions.${index}.name`}
                    />
                  </div>
                </div>
              </div>
            ))}
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
