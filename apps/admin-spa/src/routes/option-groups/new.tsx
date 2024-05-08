import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { OptionGroupForm } from "../../components/forms/option-group-form";

export const Route = createFileRoute("/option-groups/new")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "New Option Group",
  }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages };
  },
  component: CategoryNewComponent,
});

function CategoryNewComponent() {
  const { languages } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation =
    trpc.admin.catalog.optionGroups.createOptionGroup.useMutation({
      onSuccess: async () => {
        await utils.admin.catalog.category.listCategories.invalidate();
        toast.success("Option Group created");
        navigate({ to: "/option-groups" });
      },
    });

  return (
    <OptionGroupForm
      languages={languages}
      onSubmit={async (data) => {
        mutation.mutate(data);
      }}
      errorMessage={mutation.error?.message}
    />
  );
}
