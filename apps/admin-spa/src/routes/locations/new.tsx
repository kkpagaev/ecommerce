import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { LocationForm } from "../../components/forms/location-form";

export const Route = createFileRoute("/locations/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Location" }),
  component: CategoryNewComponent,
});

function CategoryNewComponent() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.inventory.location.createLocation.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("location created");
      navigate({ to: "/locations" });
    },
  });

  return (
    <div>
      <LocationForm
        onSubmit={async (data) => {
          mutation.mutate(data);
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
