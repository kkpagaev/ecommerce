import { toast } from "sonner";
import { Button, ButtonProps } from "./ui/button";

type StockStatus = "out_of_stock" | "preorder" | "in_stock";
const buttonConfig: Record<
  StockStatus,
  {
    variant: ButtonProps["variant"];
    label: string;
    disabled: boolean;
  }
> = {
  out_of_stock: { variant: "outline", label: "Out of stock", disabled: true },
  preorder: { variant: "buy", label: "Preorder", disabled: true },
  in_stock: { variant: "buy", label: "Add to cart", disabled: false },
} as const;

export function AddToCartButton({
  stockStatus,
}: {
  stockStatus: StockStatus;
  productId: number;
}) {
  const { variant, label, disabled } =
    buttonConfig[stockStatus] || buttonConfig.in_stock;

  const onClick = () => {
    toast.success("Added to cart");
  };

  return (
    <Button
      className="w-full"
      variant={variant}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
