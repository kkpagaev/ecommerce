import { toast } from "sonner";
import { Button, ButtonProps } from "./ui/button";
import useCartStore from "../storages/cart";
import { useState } from "react";
import { Input } from "./ui/input";

type StockStatus = "out_of_stock" | "preorder" | "in_stock";
const buttonConfig: Record<
  StockStatus | "remove",
  {
    variant: ButtonProps["variant"];
    label: string;
    disabled: boolean;
  }
> = {
  out_of_stock: { variant: "outline", label: "Out of stock", disabled: true },
  preorder: { variant: "buy", label: "Preorder", disabled: true },
  in_stock: { variant: "buy", label: "Add to cart", disabled: false },
  remove: { variant: "destructive", label: "Remove", disabled: false },
} as const;

export function AddToCartButton({
  stockStatus,
  product,
  withCountPicker,
}: {
  stockStatus: StockStatus;
  withCountPicker?: boolean;
  product: {
    id: number;
    name: string;
    image: string;
  };
}) {
  const cartStore = useCartStore((state) => ({
    items: state.items,
    removeItem: state.removeItem,
    addItem: state.addItem,
  }));
  const [quantity, setQuantity] = useState(1);
  const inCart = cartStore.items.some((item) => item.id === product.id);
  const { variant, label, disabled } = inCart
    ? buttonConfig["remove"]
    : buttonConfig[stockStatus] || buttonConfig.in_stock;

  const onClick = () => {
    if (inCart) {
      cartStore.removeItem(product.id);
      toast.error("Removed from cart");
      return;
    }
    cartStore.addItem({
      id: product.id,
      image: product.image,
      name: product.name,
      quantity,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="w-full flex flex-row gap-2">
      {withCountPicker && !inCart && (
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      )}

      <Button
        className="w-full"
        variant={variant}
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </Button>
    </div>
  );
}
