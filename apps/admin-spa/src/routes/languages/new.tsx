import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";
import { LanguageForm } from "../../components/forms/language-form";

export const Route = createFileRoute("/languages/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Language" }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages };
  },
  component: CategoryNewComponent,
});

function CategoryNewComponent() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const mutation = trpc.admin.language.create.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Language created");
      navigate({ to: "/languages" });
    },
  });

  return (
    <div>
      <LanguageForm
        onSubmit={async (data) => {
          mutation.mutate(data);
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
