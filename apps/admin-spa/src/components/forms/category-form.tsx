import { ErrorMessage } from "@hookform/error-message";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { ImageManager } from "../image-manager";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";
import { Combobox } from "../combobox";

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
  categories: AdminOutputs["catalog"]["category"]["listCategories"];
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
  categories,
}: CategoryFormProps) {
  const formValues: CategoryCreateInputs | undefined = values && {
    imageId: values.image_id,
    parentId: values.parent_id || undefined,
    descriptions: languages.map((lang) => {
      const old = values.descriptions.find((d) => d.language_id === lang.id);
      return {
        languageId: lang.id,
        name: old?.name || "",
      };
    }),
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    setValue,
    formState: { errors },
    watch,
  } = useApiForm({
    errorMessage,
    values: formValues,
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

  const watchParentId = watch("parentId");

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
      className="flex flex-col gap-16"
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
        <Label htmlFor="categoryId">Category</Label>
        <Combobox
          label="Select Category"
          values={categories
            .filter((c) => c.id !== values?.id)
            ?.map((c) => ({
              value: "" + c.id,
              label: c.name,
            }))}
          withReset
          defaultValue={watchParentId ? "" + watchParentId : null}
          onSelect={(v) => {
            clearErrors("parentId");
            setValue("parentId", v ? +v : 0);
          }}
        />
        <ImageManager
          preview
          enableSelect
          limit={1}
          defaultSelected={values?.image_id ? [values.image_id] : []}
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
      <div className="">
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
