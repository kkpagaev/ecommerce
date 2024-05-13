import { Label } from "@/components/ui/label";
import { ImageManager } from "../image-manager";
import { AdminInputs, AdminOutputs } from "../../utils/trpc";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useApiForm } from "../../utils/useApiForm";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useFieldArray } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Textarea } from "../ui/textarea";
import type { product_variant_stock_status } from "@repo/catalog/dist/queries/product-variants.types";
import { Checkbox } from "../ui/checkbox";

type ProductVariantCreateInputs = Omit<
  AdminInputs["catalog"]["productVariant"]["createProductVariant"],
  "productId"
>;

type ProductVariantUpdateInputs = Omit<
  AdminInputs["catalog"]["productVariant"]["updateProductVariant"],
  "id"
>;

type LanguageModel = AdminOutputs["language"]["list"][number];

type ProductVariantModel = Exclude<
  AdminOutputs["catalog"]["productVariant"]["findProductVariant"],
  null
>;

type OptionGroupModel = {
  id: number;
  name: string;
  options: { id: number; name: string }[];
};

type ProductVariantFormProps = {
  errorMessage?: string;
  values?: ProductVariantModel;
  optionGroups: OptionGroupModel[];
  languages: LanguageModel[];
} & (
  | {
      edit?: false | undefined;
      onSubmit: (data: ProductVariantCreateInputs) => void;
    }
  | {
      edit: true;
      onSubmit: (data: ProductVariantUpdateInputs) => void;
    }
);

export function ProductVariantForm({
  onSubmit,
  languages,
  errorMessage,
  values,
  optionGroups,
}: ProductVariantFormProps) {
  const formValues: ProductVariantCreateInputs | undefined = values && {
    options: values.options.map((o) => o.option_id) || [],
    price: values.price,
    oldPrice: values.old_price,
    stockStatus: values.stock_status,
    discount: values.discount,
    images: values.images as Array<string>,
    slug: values.slug,
    article: values.article || "",
    popularity: values.popularity,
    barcode: values.barcode,
    isActive: values.is_active,
    descriptions: languages.map((lang) => {
      return {
        languageId: lang.id,
        name: "",
        description: "",
        shortDescription: "",
      };
    }),
  };

  const memoOptionGroups = useMemo(() => optionGroups, [optionGroups]);
  const defaultValues: ProductVariantCreateInputs = {
    images: [],
    stockStatus: "in_stock",
    price: 0,
    oldPrice: 0,
    article: "",
    discount: 0,
    popularity: 0,
    options: [],
    slug: "",
    barcode: "",
    isActive: true,
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
    setValue,
    getValues,
    register,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: formValues,
    defaultValues: defaultValues,
  });

  const [selectedOptions, setSelectedOptions] = useState<
    Map<number, string | null>
  >(() => {
    const map = new Map();
    for (const optionGroup of memoOptionGroups) {
      map.set(
        optionGroup.id,
        values?.options.find((o) =>
          optionGroup.options.find((o2) => o2.id === o.option_id),
        )?.option_id || null,
      );
    }
    return map;
  });

  useEffect(() => {
    const values = Array.from(selectedOptions.values());

    const newOptions: number[] = [];
    for (const value of values) {
      if (value) {
        newOptions.push(parseInt(value));
      }
    }

    setValue("options", newOptions);
  }, [selectedOptions, setValue]);

  const { fields } = useFieldArray({
    control,
    name: "descriptions",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        data = {
          ...data,
          discount: +data.discount,
          popularity: +data.popularity,

          oldPrice: +data.oldPrice,
          price: +data.price,
        };
        clearErrors();
        console.log(data);
        onSubmit(data);
      })}
      className="flex flex-col gap-8"
    >
      <Card></Card>
      <Card>
        <CardHeader>Gallegry</CardHeader>
        <CardContent>
          <ImageManager
            enableSelect
            enableOrdering
            limit={5}
            defaultSelected={formValues?.["images"] || []}
            onSelectChange={(images) => {
              setValue(
                "images",
                images.map((i) => i.id),
              );
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Main Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            {(["article", "slug", "barcode"] as const).map((field, i) => (
              <div key={i}>
                <Label htmlFor={field} className="capitalize">
                  {field}
                </Label>
                <Input
                  {...register(field)}
                  defaultValue={formValues?.[field] || ""}
                  placeholder={field}
                />

                <ErrorMessage errors={errors} name={field} />
              </div>
            ))}
            <div>
              <Label htmlFor="discount">Discount</Label>
              <Input
                type="number"
                {...register("discount")}
                defaultValue={values?.discount}
                step="0.01"
                min="0"
                max="100"
                placeholder="discount"
                onKeyUp={(e) => {
                  const val = e.currentTarget.value;
                  if (val.includes(".") && val.split(".")[1].length > 2) {
                    e.currentTarget.value =
                      val.split(".")[0] + "." + val.split(".")[1].slice(0, 2);
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="popularity">Popularity</Label>
              <Input
                id="popularity"
                type="number"
                {...register("popularity")}
                defaultValue={values?.popularity}
                step="1"
                min="0"
                max="100"
                placeholder="popularity"
                onKeyUp={(e) => {
                  const val = e.currentTarget.value;
                  if (val.includes(".") && val.split(".")[1].length > 2) {
                    e.currentTarget.value =
                      val.split(".")[0] + "." + val.split(".")[1].slice(0, 2);
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              <Select
                defaultValue={formValues?.["stockStatus"] || "in_stock"}
                onValueChange={(v: product_variant_stock_status) => {
                  setValue("stockStatus", v);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={"Stock status"} />
                </SelectTrigger>
                <SelectContent>
                  {["in_stock", "out_of_stock", "preorder"].map((option, i) => (
                    <SelectItem key={i} value={option}>
                      {
                        {
                          in_stock: "In stock",
                          out_of_stock: "Out of stock",
                          preorder: "Preorder",
                        }[option]
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                name="isActive"
                id="isActive"
                defaultChecked={formValues?.isActive || true}
              />
              <Label htmlFor="isActive">Is product active</Label>
            </div>
          </div>
        </CardContent>
      </Card>
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
                      defaultValue={defaultValues.descriptions[index]?.name}
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
                        defaultValues.descriptions[index]?.shortDescription ||
                        ""
                      }
                      placeholder="Short Description"
                    />

                    <ErrorMessage
                      errors={errors}
                      name={`descriptions.${index}.shortDescription`}
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
          <CardTitle>Product Variant</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {memoOptionGroups.map((optionGroup) => (
            <div key={optionGroup.id} className="flex flex-col gap-2">
              <Label htmlFor="options">Options for - {optionGroup.name}</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedOptions.get(optionGroup.id)?.toString() || ""}
                  onValueChange={(v) => {
                    setSelectedOptions((prev) => {
                      const newMap = new Map(prev);
                      newMap.set(optionGroup.id, v);
                      return newMap;
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={optionGroup.name} />
                  </SelectTrigger>
                  <SelectContent id="options">
                    {optionGroup.options.map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="default"
                  className="w-full md:w-fit"
                  onClick={() => {
                    setSelectedOptions((prev) => {
                      const newMap = new Map(prev);
                      newMap.set(optionGroup.id, null);
                      return newMap;
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              {...register("price")}
              defaultValue={values?.price}
              step="0.01"
              min="0"
              max="1000000"
              placeholder="Price"
              onKeyUp={(e) => {
                const val = e.currentTarget.value;
                if (val.includes(".") && val.split(".")[1].length > 2) {
                  e.currentTarget.value =
                    val.split(".")[0] + "." + val.split(".")[1].slice(0, 2);
                  e.preventDefault();
                }
              }}
            />
            <ErrorMessage errors={errors} name="price" />
          </div>
          <div>
            <Label htmlFor="oldPrice">Old Price</Label>
            <Input
              type="number"
              {...register("oldPrice")}
              defaultValue={values?.old_price}
              step="0.01"
              min="0.01"
              max="1000000"
              placeholder="Old price"
              onKeyUp={(e) => {
                const val = e.currentTarget.value;
                if (val.includes(".") && val.split(".")[1].length > 2) {
                  e.currentTarget.value =
                    val.split(".")[0] + "." + val.split(".")[1].slice(0, 2);
                  e.preventDefault();
                }
              }}
            />
            <ErrorMessage errors={errors} name="oldPrice" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" variant="default" className="w-full md:w-fit">
        Save
      </Button>
    </form>
  );
}
