import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { LanguageForm } from "../../components/forms/language-form";

export const Route = createFileRoute("/vendors/$vendorId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit Language",
  }),
  loader: async ({ context, params }) => {
    const language = await context.trpc.admin.language.find.fetch({
      id: Number(params.languageId),
    });
    if (!language) {
      throw new Error("Category not found");
    }

    return { language };
  },
  component: CategoryComponent,
});

function CategoryComponent() {
  const { language } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.language.update.useMutation({
    onSuccess: async () => {
      await utils.admin.language.list.invalidate();
      toast.success("Language updated");
      navigate({ to: "/languages" });
    },
  });

  return (
    <div>
      <LanguageForm
        edit
        values={language}
        onSubmit={async (data) => {
          mutation.mutate({
            id: language.id,
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
