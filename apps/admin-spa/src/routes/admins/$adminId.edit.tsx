import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { AdminForm } from "../../components/forms/admin-form";

export const Route = createFileRoute("/admins/$adminId/edit")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Admin" }),
  loader: async ({ context, params }) => {
    const admin = await context.trpc.admin.admin.findOneAdmin.fetch({
      id: Number(params.adminId),
    });
    if (!admin) {
      throw new Error("Admin not found");
    }

    return { admin };
  },
  component: AdminNewComponent,
});

function AdminNewComponent() {
  const { admin } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const params = Route.useParams();

  const mutation = trpc.admin.admin.updateAdmin.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Admin updated");
      navigate({ to: "/admins" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <AdminForm
        edit
        values={admin}
        onSubmit={async (data) => {
          mutation.mutate({
            id: +params.adminId,
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
