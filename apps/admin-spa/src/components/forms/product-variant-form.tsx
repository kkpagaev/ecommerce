import { Label } from "@/components/ui/label";
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
  };
  const memoOptionGroups = useMemo(() => optionGroups, [optionGroups]);
  const defaultValues: ProductVariantCreateInputs = {
    options: [] as number[],
  };

  const { handleSubmit, clearErrors, setValue } = useApiForm({
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
      <Button type="submit" variant="default" className="w-full md:w-fit">
        Save
      </Button>
    </form>
  );
}
