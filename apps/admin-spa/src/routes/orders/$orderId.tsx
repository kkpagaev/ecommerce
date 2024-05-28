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

export const Route = createFileRoute("/orders/$orderId")({
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
  const params = Route.useParams();
  return (
    <div>
      <div>
        <Link
          to={"/orders/$orderId/edit"}
          params={{
            orderId: "" + params.orderId,
          }}
        >
          <Button variant="outline">Change Status</Button>
        </Link>
        <Link
          to={"/orders/$orderId"}
          params={{
            orderId: "" + params.orderId,
          }}
        >
          <Button variant="outline">View</Button>
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
