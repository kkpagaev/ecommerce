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

type ProductVariantCreateInputs = Omit<
  AdminInputs["catalog"]["productVariant"]["createProductVariant"],
  "productId"
>;

type ProductVariantUpdateInputs = Omit<
  AdminInputs["catalog"]["productVariant"]["updateProductVariant"],
  "id"
>;

type ProductVariantModel = Exclude<
  AdminOutputs["catalog"]["productVariant"]["findProductVariant"],
  null
>;

type OptionGroupModel = {
  id: number;
  name: string;
  options: { id: number; name: string }[];
};

type ProductFormProps = {
  errorMessage?: string;
  values?: ProductVariantModel;
  optionGroups: OptionGroupModel[];
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
  errorMessage,
  values,
  optionGroups,
}: ProductFormProps) {
  console.log(optionGroups);
  const formValues: ProductVariantCreateInputs | undefined = values && {
    options: values.options.map((o) => o.option_id) || [],
    slug: values.slug,
    price: values.price,
    oldPrice: values.old_price,
    inStock: values.in_stock,
    article: values.article || "",
    discount: values.discount,
    popularity: values.popularity,
    images: values.images as Array<string>,
    barcode: values.barcode,
    isActive: values.is_active,
  };

  const memoOptionGroups = useMemo(() => optionGroups, [optionGroups]);
  const defaultValues: ProductVariantCreateInputs = {
    images: [], //
    inStock: true,
    price: 0,
    oldPrice: 0,
    article: "",
    discount: 0,
    popularity: 0,
    options: [],
    slug: "",
    barcode: "",
    isActive: true,
  };

  const { handleSubmit, clearErrors, setValue, getValues, register } =
    useApiForm({
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
          <CardTitle>Product Variant</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {memoOptionGroups.map((optionGroup) => (
            <div key={optionGroup.id} className="flex flex-col gap-2">
              <Label htmlFor="options">Options for - {optionGroup.name}</Label>

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
                <SelectContent>
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
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Input
              type="number"
              {...register("price")}
              defaultValue={values?.price}
              step="0.01"
              min="0.01"
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
          </div>
          <div>
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
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>Gallegry</CardHeader>
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

      <Button type="submit" variant="default" className="w-full md:w-fit">
        Save
      </Button>
    </form>
  );
}
