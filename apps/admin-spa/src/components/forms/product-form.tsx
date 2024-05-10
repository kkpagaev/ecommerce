import { ErrorMessage } from "@hookform/error-message";
import { useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useApiForm } from "../../utils/useApiForm";
import { Combobox } from "../combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageManager } from "../image-manager";
import { useMemo } from "react";
import { Textarea } from "../ui/textarea";

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

type ProductFormProps = {
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
  optionGroups,
}: ProductFormProps) {
  const formValues: ProductCreateInputs | undefined = values && {
    optionGroups: values.optionGroups,
    price: values.price,
    categoryId: values.category_id,
    attributes: values.attributes || [],
    options: values.options || [],
    images: values.images || [],
    descriptions: languages.map((lang) => {
      const old = values.descriptions.find((d) => d.language_id === lang.id);
      return {
        languageId: lang.id,
        name: old?.name || "",
        description: old?.description || "",
      };
    }),
  };
  const defaultValues: ProductCreateInputs = {
    price: 0,
    categoryId: 0,
    optionGroups: [] as number[],
    attributes: [] as number[],
    images: [] as string[],
    descriptions: languages.map((lang) => {
      return {
        languageId: lang.id,
        name: "",
        description: "",
      };
    }),
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    getValues,
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
  const watchOptions = watch("options");

  const filteredOptionGroups = useMemo(() => {
    return optionGroups.filter((group) => watchOptionGroups.includes(group.id));
  }, [watchOptionGroups, optionGroups]);

  const { fields } = useFieldArray({
    control,
    name: "descriptions",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (data.price) {
          data.price = Number(data.price);
        }
        clearErrors();
        onSubmit(data);
      })}
      className="flex flex-col gap-8"
    >
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-8">
                {fields.map((field, index) => (
                  <div key={index}>
                    <CardTitle>
                      {
                        languages.find((lang) => lang.id === field.languageId)
                          ?.name
                      }
                    </CardTitle>
                    <div key={field.id} className="flex flex-col gap-4">
                      <div>
                        <Label htmlFor={`descriptions.${index}.name`}>
                          Name
                        </Label>
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
              <CardTitle>Price</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                {...register("price")}
                defaultValue={values?.price}
                step="0.01"
                min="0.01"
                max="1000000"
                onKeyUp={(e) => {
                  const val = e.currentTarget.value;
                  if (val.includes(".") && val.split(".")[1].length > 2) {
                    e.currentTarget.value =
                      val.split(".")[0] + "." + val.split(".")[1].slice(0, 2);
                    e.preventDefault();
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="relations">
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
                  defaultValue={watchOptionGroups.map((v) => "" + v) || []}
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
                      options:
                        prev.options?.filter((optionId) => {
                          const optionGroup = filteredOptionGroups.find((g) =>
                            g.options.map(({ id }) => id).includes(+optionId),
                          );
                          return !!optionGroup;
                        }) || [],
                    }));
                  }}
                />
              </div>
              {filteredOptionGroups.map((optionGroup) => (
                <div>
                  <Label htmlFor="options">
                    Options for - {optionGroup.name}
                  </Label>

                  <Combobox
                    multi
                    label="Select Option"
                    values={optionGroup.options.map((o) => ({
                      value: "" + o.id,
                      label: o.name,
                    }))}
                    defaultValue={watchOptions?.map((v) => "" + v) || []}
                    onSelect={(v) => {
                      clearErrors("options");
                      setValue(
                        "options",
                        v.map((v) => +v),
                      );
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageManager
                enableSelect
                enableOrdering
                limit={5}
                defaultSelected={getValues("images")}
                onSelectChange={(images) => {
                  setValue(
                    "images",
                    images.map((i) => i.id),
                  );
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div>
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
