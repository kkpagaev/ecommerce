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

type ProductFormProps = {
  errorMessage?: string;
  languages: LanguageModel[];
  values?: ProductModel;
  categories: CategoryModel[];
  attributes: AttributeModel[];
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
      images: values.images || [],
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
      categoryId: 0,
      attributes: [] as number[],
      images: [] as string[],
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
                  defaultValue={
                    getValues("categoryId") === 0
                      ? undefined
                      : "" + getValues("categoryId")
                  }
                  onSelect={(v) => {
                    clearErrors("categoryId");
                    setValue("categoryId", +v);
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
                  defaultValue={getValues("attributes").map((v) => "" + v)}
                  onSelect={(v) => {
                    clearErrors("attributes");
                    setValue(
                      "attributes",
                      v.map((v) => +v),
                    );
                  }}
                />
              </div>
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