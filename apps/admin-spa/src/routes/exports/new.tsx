import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { trpc } from "../../utils/trpc";
import { toast } from "sonner";

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

    return {
      languages,
      productVariantIds: deps.productVariantIds,
    };
  },
  component: CreateExportComponent,
});

function CreateExportComponent() {
  const { productVariantIds } = Route.useLoaderData();
  const [type, setType] = useState<"hotline" | "prom" | null>(null);
  const mutation = trpc.admin.catalog.exports.export.useMutation({
    onSuccess(data) {
      console.log(data);
      toast.success("Export created");
    },
  });
  const [exportsUrls, setExportsUrls] = useState<string[]>([]);
  return (
    <div>
      <Select
        onValueChange={(v) => {
          setType(v as any);
        }}
        value={type ? type : undefined}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"hotline"}>Hotline</SelectItem>
          <SelectItem value={"prom"}>Prom</SelectItem>
        </SelectContent>
      </Select>
      <div>
        {exportsUrls.map((url) => (
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        ))}
      </div>
      <Button
        variant="default"
        onClick={() => {
          if (!type) {
            return;
          }
          mutation
            .mutateAsync({
              marketPlace: type,
              languageId: 1,
              firmName: "Ecommerce",
              variantIds: productVariantIds || [],
            })
            .then((data) => {
              if (data) {
                setExportsUrls([...exportsUrls, data.url]);
              }
            });
        }}
      >
        Create
      </Button>
    </div>
  );
}
