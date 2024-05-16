import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/exports/new")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Create new export",
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        productVariantIds: z.array(z.number()).optional(),
      })
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    productVariantIds: search.productVariantIds,
  }),
  loader: async ({ context, params, deps }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages, productVariantIds: deps.productVariantIds };
  },
  component: CreateExportComponent,
});

function CreateExportComponent() {
  return <div>test</div>;
}
