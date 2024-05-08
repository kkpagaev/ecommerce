import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { OptionForm } from "../../components/forms/option-form";

export const Route = createFileRoute(
  "/option-groups/$optionGroupId/option/new",
)({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "New option",
  }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages };
  },
  component: New,
});

function New() {
  const { languages } = Route.useLoaderData();
  const params = Route.useParams();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.catalog.option.createOption.useMutation({
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
      languages={languages}
      onSubmit={async (data) => {
        mutation.mutate({
          groupId: Number(params.optionGroupId),
          ...data,
        });
      }}
      errorMessage={mutation.error?.message}
    />
  );
}
