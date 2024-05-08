import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { OptionForm } from "../../components/forms/option-form";

export const Route = createFileRoute(
  "/option-groups/$optionGroupId/option/$optionId/edit",
)({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "New option",
  }),
  loader: async ({ context, params }) => {
    const languages = await context.trpc.admin.language.list.fetch();
    const option = await context.trpc.admin.catalog.option.findOneOption.fetch({
      id: Number(params.optionId),
    });
    if (!option) {
      throw new Error("Option not found");
    }

    return { languages, option };
  },
  component: Edit,
});

function Edit() {
  const { languages, option } = Route.useLoaderData();
  const params = Route.useParams();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.option.updateOption.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.option.listOptions.invalidate({
        groupId: Number(params.optionGroupId),
      });
      toast.success("Option created");
      navigate({ to: "/option-groups/$optionGroupId", params });
    },
  });

  return (
    <OptionForm
      edit
      values={option}
      languages={languages}
      onSubmit={async (data) => {
        mutation.mutate({
          id: option.id,
          ...data,
        });
      }}
      errorMessage={mutation.error?.message}
    />
  );
}
