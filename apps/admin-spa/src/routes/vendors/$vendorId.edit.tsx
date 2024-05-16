import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { VendorForm } from "@/components/forms/vendor-form";

export const Route = createFileRoute("/vendors/$vendorId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Vendor",
  }),
  loader: async ({ context, params }) => {
    const vendor = await context.trpc.admin.vendor.find.fetch({
      id: +params.vendorId,
    });

    if (!vendor) {
      throw new Error("Category not found");
    }

    return { vendor };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { vendor } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.vendor.update.useMutation({
    onSuccess: async () => {
      await utils.admin.language.list.invalidate();
      toast.success("Language updated");
      navigate({ to: "/vendors" });
    },
  });

  return (
    <div>
      <VendorForm
        edit
        values={vendor}
        onSubmit={async (data) => {
          mutation.mutate({
            id: vendor.id,
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
