import { ShoppingCart, Trash2 } from "lucide-react";
import useCartStore from "../storages/cart";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ProductImage } from "./product-image";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./ui/sheet";
import { Link } from "@tanstack/react-router";

export function Cart() {
  const cartStore = useCartStore();

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <div className="bg-gray-700 rounded-full relative p-2 text-white">
            <div className="absolute p-1 -top-2 -left-2 bg-red-500 rounded-full">
              {cartStore.items.length}
            </div>
            <ShoppingCart className="h-4 w-4" />
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Cart</SheetTitle>
            <SheetDescription className="h-full flex flex-col justify-between">
              {cartStore.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="h-24 w-24">
                      <ProductImage id={item.image} />
                    </div>
                  </div>
                  <div className="w-full px-2 flex flex-col gap-2">
                    <div className="text-xl text-bold text-start">
                      {item.name}
                    </div>
                    <div className="text-sm text-blue-600 text-end flex justify-between">
                      <div>
                        {item.quantity} x {item.price} ₴ ={" "}
                        {item.price * item.quantity} ₴
                      </div>
                      <div>
                        <Button
                          variant="destructive"
                          className=""
                          onClick={() => cartStore.removeItem(item.id)}
                        >
                          <Trash2 className="inline-block h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                to="/$ln/checkout"
                className="w-full"
                params={(prev: any) => ({ ...prev })}
              >
                <Button className="w-full">Checkout</Button>
              </Link>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
