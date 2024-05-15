import { toast } from "sonner";
import { Button, ButtonProps } from "./ui/button";
import useCartStore from "../storages/cart";

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
  productId,
}: {
  stockStatus: StockStatus;
  productId: number;
}) {
  const { variant, label, disabled } =
    buttonConfig[stockStatus] || buttonConfig.in_stock;
  const cartStore = useCartStore((state) => ({
    items: state.items,
    addItem: state.addItem,
  }));

  const onClick = () => {
    cartStore.addItem({ id: productId, quantity: 1, name: "foo" });
    toast.success("Added to cart");
  };

  return (
    <Button
      className="w-full"
      variant={variant}
      disabled={
        disabled || !!cartStore.items.some((item) => item.id === productId)
      }
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
