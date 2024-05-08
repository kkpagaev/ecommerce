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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { cn } from "../../lib/utils";

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
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
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
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <Combobox
                multi
                label="Select Category"
                values={categories.map((c) => ({
                  value: "" + c.id,
                  label: c.name,
                }))}
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
                limit={1}
                // defaultSelected={values?.image_id ? [values.image_id] : []}
                onSelectChange={(images) => {
                  console.log({ images });
                  // if (images.length > 0) {
                  //   register("imageId").onChange({
                  //     target: {
                  //       name: "imageId",
                  //       value: images[0].id,
                  //     },
                  //   });
                  // }
                }}
              />

              <Carousel>
                <CarouselContent>
                  {undefined?.map((file) => {
                    const image = data?.find((i) => i.id === file);
                    if (!image) {
                      return null;
                    }
                    return (
                      <CarouselItem className="xl:basis-1/3" key={image.id}>
                        <AspectRatio
                          ratio={4 / 4}
                          className={cn(
                            "relative rounded-md border-slate-200 border-2",
                          )}
                        >
                          <div className="w-full h-full">
                            <div
                              className={cn(
                                "absolute inset-0 invisible opacity-0 duration-200 transition-all bg-slate-400/50",
                              )}
                            />

                            <img
                              src={image.url}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </AspectRatio>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
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
