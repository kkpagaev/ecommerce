import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { AttributeForm } from "../../components/forms/attribute-form";

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
      throw new Error("Attribute not found");
    }

    return { attribute, languages };
  },
  component: AttributeEdit,
});

function AttributeEdit() {
  const { attribute, languages } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const params = Route.useParams();

  const mutation = trpc.admin.catalog.attribute.updateAttribute.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.attribute.findAllGroupAttributes.invalidate({
        groupId: Number(params.attributeGroupId),
      });
      toast.success("Attribute updated");
      navigate({ to: "/attribute-groups/$attributeGroupId", params });
    },
  });

  return (
    <AttributeForm
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
  );
}
