import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { VendorForm } from "../../components/forms/vendor-form";

export const Route = createFileRoute("/vendors/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Vendor" }),
  loader: async ({ context }) => {
    const vendors = await context.trpc.admin.vendor.list.fetch();

    return { vendors };
  },
  component: CategoryNewComponent,
});

function CategoryNewComponent() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.vendor.create.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Vendor created");
      navigate({ to: "/vendors" });
    },
  });

  return (
    <div>
      <VendorForm
        onSubmit={async (data) => {
          mutation.mutate(data);
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
