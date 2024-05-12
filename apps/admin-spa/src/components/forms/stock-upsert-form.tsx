import { useFieldArray } from "react-hook-form";
import { AdminInputs } from "../../utils/trpc";
import { useApiForm } from "../../utils/useApiForm";
import { ErrorMessage } from "@hookform/error-message";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type StockUpsertInput = AdminInputs["inventory"]["stocks"]["upsertStock"];

type ProductVariantStockModel = {
  locations: Map<number, string>;
  options: Map<number, string>;
  productVariations: Array<{
    id: number;
    count: number;
    locationId: number;
    options: Array<{
      id: number;
      name: string;
    }>;
  }>;
};

type Props = {
  values: ProductVariantStockModel;
  onSubmit: (values: StockUpsertInput) => void;
  errorMessage: string | undefined;
};
export function StockUpsertForm({ values, errorMessage, onSubmit }: Props) {
  const formValues: Array<
    Exclude<StockUpsertInput[0], null> & {
      options: number[];
    }
  > = values.productVariations.map((v) => ({
    count: v.count,
    locationId: v.locationId,
    productVariantId: v.id,
    options: v.options.map((o) => o.id),
  }));

  const {
    handleSubmit,
    register,
    control,
    clearErrors,
    formState: { errors },
  } = useApiForm({
    errorMessage,
    values: {
      stocks: formValues,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "stocks",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        clearErrors();
        onSubmit(data.stocks.map((s) => ({ ...s, count: +s.count })));
      })}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-8">
        {fields.map((field, index) => (
          <div key={index}>
            <div key={field.id} className="flex flex-col gap-4">
              <div>
                <Label htmlFor={`stocks.${index}.count`}>
                  {values.locations.get(field.locationId)} -{" "}
                  {field.options.map((o) => values.options.get(o)).join(", ")}
                </Label>
                <Input
                  {...register(`stocks.${index}.count`)}
                  type="number"
                  defaultValue={field.count}
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
      <div>
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}
