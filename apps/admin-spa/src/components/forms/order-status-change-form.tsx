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

type ChangeStatus = Omit<AdminInputs["orders"]["changeStatus"], "id">;
type Order = Exclude<AdminOutputs["orders"]["findOne"], null>;

type Props = {
  values: Order;
  onSubmit: (data: { status: string }) => void;
};

export function OrderStatusChangeForm({ onSubmit, values }: Props) {
  const formValues: ChangeStatus = {
    status: values.status as any,
  };
  const { handleSubmit, clearErrors, setValue } = useApiForm({
    values: formValues,
    defaultValues: formValues,
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
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div>
              <Label htmlFor="vendorId">Change status</Label>
              <Select
                defaultValue={formValues.status}
                onValueChange={(v) => {
                  setValue("status", v as any);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue id="vendorId" placeholder={"Vendor"} />
                </SelectTrigger>
                <SelectContent>
                  {["cancelled", "created", "processing", "shipped"].map(
                    (v, i) => (
                      <SelectItem key={i} value={v}>
                        {v}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
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
