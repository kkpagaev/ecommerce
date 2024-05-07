import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchFilters } from "../../components/search-filters";
import { z } from "zod";
import { DataTable } from "../../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AdminOutputs } from "../../utils/trpc";

export const Route = createFileRoute("/attribute-groups/$attributeGroupId")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "View attribute group",
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        languageId: z.number().optional(),
      })
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    languageId: search.languageId || 1,
  }),
  loader: async ({ context, params, deps }) => {
    const attributeGroup =
      await context.trpc.admin.catalog.attributeGroup.findOneAttributeGroup.fetch(
        {
          id: Number(params.attributeGroupId),
        },
      );
    if (!attributeGroup) {
      throw new Error("Category not found");
    }

    const attributes =
      await context.trpc.admin.catalog.attribute.findAllGroupAttributes.fetch({
        groupId: attributeGroup.id,
        languageId: deps.languageId,
      });

    return { attributeGroup, attributes, languageId: deps.languageId };
  },
  component: CategoryComponent,
});

type Attribute =
  AdminOutputs["catalog"]["attribute"]["findAllGroupAttributes"][0];

function CategoryComponent() {
  const { attributeGroup, attributes, languageId } = Route.useLoaderData();

  return (
    <div className="container mx-auto py-10">
      <SearchFilters
        fullPath={Route.fullPath}
        title="Dispay Settings"
        search={Route.useSearch()}
        filters={[
          {
            name: "languageId",
            type: "languageId",
          },
        ]}
      />
      <h2>
        {
          attributeGroup.descriptions.find((d) => d.language_id === languageId)
            ?.name
        }
      </h2>
      <div>
        {attributes.map((a) => {
          return <div>{a.name}</div>;
        })}
      </div>
    </div>
  );
}
