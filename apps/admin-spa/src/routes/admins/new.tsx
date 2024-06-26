import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { AdminForm } from "../../components/forms/admin-form";

export const Route = createFileRoute("/admins/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Admin" }),
  component: AdminNewComponent,
});

function AdminNewComponent() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.admin.createAdmin.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Admin created");
      navigate({ to: "/admins" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <AdminForm
        onSubmit={async (data) => {
          mutation.mutate(data);
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
