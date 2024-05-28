import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { AdminForm } from "../../components/forms/admin-form";
import { Button } from "../../components/ui/button";
import { ProductImage } from "../../components/product-image";

export const Route = createFileRoute("/orders/$orderId/")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "Order" }),
  component: AdminNewComponent,
  loader: async ({ context, params }) => {
    const order = await context.trpc.admin.orders.findOne.fetch({
      id: Number(params.orderId),
      languageId: 1,
    });
    if (!order) {
      throw new Error("Order not found");
    }

    return { order };
  },
});

function AdminNewComponent() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const { order } = Route.useLoaderData();

  return (
    <div>
      <h2 className="mb-2">Items</h2>
      {order.items.map((item) => (
        <div key={item.product_variant_id} className="flex gap-2">
          <div className="w-24 h-24">
            <ProductImage id={item.images[0]} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg bold">{item.name}</h1>
            <p>
              Total price: {item.price} * {item.quantity} ={" "}
              {+item.price * +item.quantity}{" "}
            </p>
            <Link
              to={"/products/$productId/variants/$productVariantId/edit"}
              params={{
                productId: "" + ((item as any).product_id as any),
                productVariantId: "" + item.product_variant_id,
              }}
            >
              <Button variant="default">View</Button>
            </Link>
          </div>
        </div>
      ))}
      <Outlet />
    </div>
  );
}
