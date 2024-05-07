import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { AttributeGroupForm } from "../../components/forms/attribute-group-form";

export const Route = createFileRoute(
  "/attribute-groups/$attributeGroupId/attribute/$attributeId/edit",
)({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Attribute Group",
  }),
  loader: async ({ context, params }) => {
    const languages = await context.trpc.admin.language.list.fetch();
    const attribute =
      await context.trpc.admin.catalog.attribute.findOneAttribute.fetch({
        id: Number(params.attributeId),
      });
    if (!attribute) {
      throw new Error("Category not found");
    }

    return { attribute, languages };
  },
  component: AttributeEdit,
});

function AttributeEdit() {
  const { attribute, languages } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation =
    trpc.admin.catalog.attributeGroup.updateAttributeGroup.useMutation({
      onSuccess: async () => {
        await utils.admin.catalog.attributeGroup.listAttributeGroups.invalidate();
        toast.success("Attribute Group updated");
        navigate({ to: "/attribute-groups" });
      },
    });

  return (
    <div className="container mx-auto py-10">
      <AttributeGroupForm
        edit
        values={attribute as any}
        languages={languages}
        onSubmit={async (data) => {
          mutation.mutate({
            id: attribute.id,
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
