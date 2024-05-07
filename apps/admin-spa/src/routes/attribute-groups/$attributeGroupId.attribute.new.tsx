import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { AttributeForm } from "../../components/forms/attribute-form";

export const Route = createFileRoute(
  "/attribute-groups/$attributeGroupId/attribute/new",
)({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "New attribute",
  }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages };
  },
  component: AttributeNew,
});

function AttributeNew() {
  const { languages } = Route.useLoaderData();
  const params = Route.useParams();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.attribute.createAttribue.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.attribute.findAllGroupAttributes.invalidate({
        groupId: Number(params.attributeGroupId),
      });
      toast.success("Attribute created");
      navigate({ to: "/attribute-groups/$attributeGroupId", params });
    },
  });

  return (
    <div>
      <AttributeForm
        languages={languages}
        onSubmit={async (data) => {
          mutation.mutate({
            groupId: Number(params.attributeGroupId),
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
