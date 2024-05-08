import { ErrorMessage } from "@hookform/error-message";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";
import { Combobox } from "../combobox";

type ProductCreateInputs = AdminInputs["catalog"]["product"]["createProduct"];

type ProductUpdateInputs = Omit<
  AdminInputs["catalog"]["product"]["updateProduct"],
  "id"
>;

type LanguageModel = AdminOutputs["language"]["list"][number];
type ProductModel = Exclude<
  AdminOutputs["catalog"]["product"]["findOneProduct"],
  null
>;

type CategoryModel = {
  id: number;
  name: string;
};

type ProductFormProps = {
  errorMessage?: string;
  languages: LanguageModel[];
  values?: ProductModel;
  categories: CategoryModel[];
} & (
  | {
      edit?: false | undefined;
      onSubmit: (data: ProductCreateInputs) => void;
    }
  | {
      edit: true;
      onSubmit: (data: ProductUpdateInputs) => void;
    }
);

export function ProductForm({
  languages,
  onSubmit,
  errorMessage,
  values,
  categories,
}: ProductFormProps) {
  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: values && {
      price: values.price,
      categoryId: values.category_id,
      attributes: values.attributes || [],
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
      price: 0,
      categoryId: undefined as undefined | number,
      attributes: [],
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
  const currentValues = getValues();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        clearErrors();
        console.log(data);
        // onSubmit(data);
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
        <Combobox
          multi
          label="Select Category"
          values={categories.map((c) => ({ value: "" + c.id, label: c.name }))}
          defaultValue={
            typeof currentValues.categoryId === "number"
              ? ["" + currentValues.categoryId]
              : undefined
          }
          onSelect={(v) => {
            console.log(v);
            clearErrors("categoryId");
            setValue("categoryId", +v);
          }}
        />
      </div>
      <div>
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
