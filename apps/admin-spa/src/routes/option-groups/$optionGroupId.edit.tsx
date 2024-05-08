import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { OptionGroupForm } from "../../components/forms/option-group-form";

export const Route = createFileRoute("/option-groups/$optionGroupId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Option Group",
  }),
  loader: async ({ context, params }) => {
    const optionGroup =
      await context.trpc.admin.catalog.optionGroups.findOptionGroup.fetch({
        id: Number(params.optionGroupId),
      });
    if (!optionGroup) {
      throw new Error("Category not found");
    }
    const languages = await context.trpc.admin.language.list.fetch();

    return { optionGroup, languages };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { optionGroup, languages } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const params = Route.useParams();

  const mutation =
    trpc.admin.catalog.optionGroups.updateOptionGroup.useMutation({
      onSuccess: async () => {
        await utils.admin.catalog.optionGroups.listOptionGroups.invalidate();
        await utils.admin.catalog.optionGroups.findOptionGroup.invalidate({
          id: Number(params.optionGroupId),
        });
        toast.success("Option Group updated");
        navigate({
          to: "/option-groups/$optionGroupId",
          params: {
            optionGroupId: optionGroup.id.toString(),
          },
        });
      },
    });

  return (
    <OptionGroupForm
      edit
      values={optionGroup}
      languages={languages}
      onSubmit={async (data) => {
        mutation.mutate({
          id: optionGroup.id,
          ...data,
        });
      }}
      errorMessage={mutation.error?.message}
    />
  );
}
