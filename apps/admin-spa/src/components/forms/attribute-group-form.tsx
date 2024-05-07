import { ErrorMessage } from "@hookform/error-message";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";
import { Textarea } from "../ui/textarea";

type AttributeGroupCreateInputs =
  AdminInputs["catalog"]["attributeGroup"]["createAttributeGroup"];

type AttributeGroupUpdateInputs = Omit<
  AdminInputs["catalog"]["attributeGroup"]["createAttributeGroup"],
  "id"
>;

type LanguageModel = AdminOutputs["language"]["list"][number];
type AttributeGroupModel = Exclude<
  AdminOutputs["catalog"]["attributeGroup"]["findOneAttributeGroup"],
  null
>;

type AttributeGroupFormProps = {
  errorMessage?: string;
  languages: LanguageModel[];
  values?: AttributeGroupModel;
} & (
  | {
      edit?: false | undefined;
      onSubmit: (data: AttributeGroupCreateInputs) => void;
    }
  | {
      edit: true;
      onSubmit: (data: AttributeGroupUpdateInputs) => void;
    }
);

export function AttributeGroupForm({
  languages,
  onSubmit,
  errorMessage,
  values,
}: AttributeGroupFormProps) {
  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: values && {
      descriptions: languages.map((lang) => {
        const old = values.descriptions.find((d) => d.language_id === lang.id);
        return {
          languageId: lang.id,
          name: old?.name || "",
          description: old?.description || "",
        };
      }),
    },
    defaultValues: {
      descriptions: languages.map((lang) => {
        return {
          languageId: lang.id,
          name: "",
          description: "",
        };
      }),
    },
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
          {fields.map((field, index) => (
            <div key={index}>
              <CardTitle>
                {languages.find((lang) => lang.id === field.languageId)?.name}
              </CardTitle>
              <div key={field.id} className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor={`descriptions.${index}.description`}>
                    Description
                  </Label>
                  <Textarea
                    {...register(`descriptions.${index}.description`)}
                    placeholder="description"
                    defaultValue={
                      values?.descriptions[index]?.description || ""
                    }
                    rows={5}
                  />
                  <ErrorMessage
                    errors={errors}
                    name={`descriptions.${index}.description`}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="md:col-span-2">
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
