import { ErrorMessage } from "@hookform/error-message";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";
import { Combobox } from "../combobox";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
type AttributeModel = {
  id: number;
  name: string;
};

type OptionGroupModel = {
  id: number;
  name: string;
  options: { id: number; name: string }[];
};

type VendorModel = {
  id: number;
  name: string;
};

type ProductFormProps = {
  vendors: VendorModel[];
  errorMessage?: string;
  languages: LanguageModel[];
  values?: ProductModel;
  categories: CategoryModel[];
  attributes: AttributeModel[];
  optionGroups: OptionGroupModel[];
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
  attributes,
  vendors,
  optionGroups,
}: ProductFormProps) {
  const formValues: ProductCreateInputs | undefined = values && {
    optionGroups: values.optionGroups,
    categoryId: values.category_id,
    vendorId: values.vendor_id,
    attributes: values.attributes || [],
    descriptions: languages.map((lang) => {
      const old = values.descriptions.find((d) => d.language_id === lang.id);
      return {
        languageId: lang.id,
        name: old?.name || "",
        description: old?.description || "",
        shortDescription: old?.short_description || "",
      };
    }),
  };
  const defaultValues: ProductCreateInputs = {
    categoryId: 0,
    vendorId: vendors[0].id || 1,
    optionGroups: [] as number[],
    attributes: [] as number[],
    descriptions: languages.map((lang) => {
      return {
        languageId: lang.id,
        name: "",
        description: "",
        shortDescription: "",
      };
    }),
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: formValues,
    defaultValues: defaultValues,
  });
  const watchCategoryId = watch("categoryId");
  const watchAttributes = watch("attributes");
  const watchOptionGroups = watch("optionGroups");

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
                  <div>
                    <Label htmlFor={`descriptions.${index}.shortDescription`}>
                      Short Description
                    </Label>
                    <Textarea
                      {...register(`descriptions.${index}.shortDescription`)}
                      defaultValue={
                        values?.descriptions[index]?.short_description || ""
                      }
                      placeholder="Short Description"
                    />

                    <ErrorMessage
                      errors={errors}
                      name={`descriptions.${index}.shortDescription`}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`descriptions.${index}.description`}>
                      Description
                    </Label>
                    <Textarea
                      {...register(`descriptions.${index}.description`)}
                      defaultValue={values?.descriptions[index]?.name}
                      placeholder="description"
                    />

                    <ErrorMessage
                      errors={errors}
                      name={`descriptions.${index}.description`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Relations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Combobox
              label="Select Category"
              values={categories.map((c) => ({
                value: "" + c.id,
                label: c.name,
              }))}
              defaultValue={"" + watchCategoryId}
              onSelect={(v) => {
                clearErrors("categoryId");
                setValue("categoryId", v ? +v : 0);
              }}
            />
          </div>

          <div>
            <Label htmlFor="vendorId">Vendor</Label>
            <Select
              defaultValue={
                formValues?.["vendorId"]
                  ? "" + formValues?.["vendorId"]
                  : undefined
              }
              onValueChange={(v) => {
                setValue("vendorId", +v);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue id="vendorId" placeholder={"Vendor"} />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={"" + v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="attributes">Attributes</Label>
            <Combobox
              multi
              label="Select Attibutes"
              values={attributes.map((c) => ({
                value: "" + c.id,
                label: c.name,
              }))}
              defaultValue={watchAttributes?.map((v) => "" + v) || []}
              onSelect={(v) => {
                clearErrors("attributes");
                setValue(
                  "attributes",
                  v.map((v) => +v),
                );
              }}
            />
          </div>
          <Label htmlFor="attributes">Option Group</Label>
          <div>
            <Combobox
              multi
              withReset
              label="Select Option Group"
              values={optionGroups.map((c) => ({
                value: "" + c.id,
                label: c.name,
              }))}
              defaultValue={watchOptionGroups?.map((v) => "" + v) || []}
              onSelect={(v) => {
                clearErrors("optionGroups");
                if (v.length === 0) {
                  reset((prev) => ({
                    ...prev,
                    optionGroups: [],
                    options: [],
                  }));
                  return;
                }
                reset((prev) => ({
                  ...prev,
                  optionGroups: v.map((v) => +v),
                }));
              }}
            />
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
