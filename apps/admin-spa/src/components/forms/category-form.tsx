import { ErrorMessage } from "@hookform/error-message";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { ImageManager } from "../image-manager";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";

type CategoryCreateInputs =
  AdminInputs["catalog"]["category"]["createCategory"];

type CategoryUpdateInputs = Omit<
  AdminInputs["catalog"]["category"]["updateCategory"],
  "id"
>;

type LanguageModel = AdminOutputs["language"]["list"][number];
type CategoryModel = Exclude<
  AdminOutputs["catalog"]["category"]["findCategoryById"],
  null
>;

type CategoryFormProps = {
  errorMessage?: string;
  languages: LanguageModel[];
  values?: CategoryModel;
} & (
  | {
      edit?: false | undefined;
      onSubmit: (data: CategoryCreateInputs) => void;
    }
  | {
      edit: true;
      onSubmit: (data: CategoryUpdateInputs) => void;
    }
);

export function CategoryForm({
  languages,
  onSubmit,
  errorMessage,
  values,
}: CategoryFormProps) {
  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: values && {
      imageId: values.image_id,
      descriptions:
        values.descriptions.map((d) => {
          return {
            languageId: d.language_id,
            name: d.name,
          };
        }) || [],
    },
    defaultValues: {
      imageId: undefined,
      descriptions: languages.map((lang) => {
        return {
          languageId: lang.id,
          name: "",
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
      className="grid md:grid-cols-2 gap-16"
    >
      <Card>
        <CardHeader>
          <CardTitle>Name transtlation</CardTitle>
        </CardHeader>
        <CardContent>
          {fields.map((field, index) => (
            <div key={field.id}>
              <Label>
                {languages.find((lang) => lang.id === field.languageId)?.name}
              </Label>

              <Input
                {...register(`descriptions.${index}.name`)}
                defaultValue={values?.descriptions[index]?.name}
              />
              <ErrorMessage
                errors={errors}
                name={`descriptions.${index}.name`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <ImageManager
          enableSelect
          limit={1}
          onSelectChange={(images) => {
            if (images.length > 0) {
              register("imageId").onChange({
                target: {
                  name: "imageId",
                  value: images[0].id,
                },
              });
            }
          }}
        />
        <ErrorMessage errors={errors} name={"imageId"} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
