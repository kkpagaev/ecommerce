import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { AdminForm } from "../../components/forms/admin-form";
import { OrderStatusChangeForm } from "../../components/forms/order-status-change-form";

export const Route = createFileRoute("/orders/$orderId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Change order status",
  }),
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
  component: OrderEdit,
});

function OrderEdit() {
  const { order } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const params = Route.useParams();

  const mutation = trpc.admin.orders.changeStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.orders.listOrders.invalidate();
      toast.success("Order updated");
      navigate({ to: "/admins" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <OrderStatusChangeForm
        values={order}
        onSubmit={async (data) => {
          mutation.mutate({
            id: +params.orderId,
            status: data.status as any,
          });
        }}
      />
    </div>
  );
}
