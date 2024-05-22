import { createFileRoute } from "@tanstack/react-router";
import useCartStore from "@/storages/cart";
import { ProductImage } from "../../components/product-image";
import { getAreas } from "../../api/np";
import { NpSelect } from "../../components/np-select";

export const Route = createFileRoute("/$ln/checkout")({
  loader: async () => {
    const areas = await getAreas();

    return { areas };
  },
  component: Checkout,
});

function Checkout() {
  const cartStore = useCartStore();
  const { areas } = Route.useLoaderData();

  return (
    <div>
      <NpSelect areas={areas} />
      {cartStore.items.map((item) => (
        <div key={item.id} className="flex justify-between">
          <div className="flex gap-2">
            <div className="h-24 w-24">
              <ProductImage id={item.image} />
            </div>
          </div>
          <div className="w-full px-2 flex flex-col gap-2">
            <div className="text-xl text-bold text-start">{item.name}</div>
            <div className="text-sm text-end flex justify-between">
              <div>
                {item.quantity} x {item.price} ₴ = {item.price * item.quantity}{" "}
                ₴
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
