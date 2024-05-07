import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/collumns";
import { z } from "zod";
import React from "react";
import { SearchFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import { OutletDialog } from "@/components/ui/dialog-outlet";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Route = createFileRoute("/categories")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "Categories" }),
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        languageId: z.number().optional(),
        name: z.string().optional(),
      })
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    languageId: search.languageId || 1,
    name: search.name,
  }),
  loader: async ({ context, deps }) => {
    return await context.trpc.admin.catalog.category.listCategories.fetch({
      name: deps.name,
      languageId: deps.languageId,
    });
  },
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div className="container mx-auto py-10">
      <div className="w-full flex flex-row gap-10">
        <SearchFilters
          search={Route.useSearch()}
          fullPath={Route.fullPath}
          filters={[
            { name: "name", type: "string", label: "Name" },
            { type: "languageId", name: "languageId" },
          ]}
        />
        <div>
          <Link to={"/categories/new"}>
            <Button variant="default">New</Button>
          </Link>
        </div>
      </div>
      <DataTable data={data} columns={columns} isLoading={false} />
      <OutletDialog path={Route.fullPath} />
    </div>
  );
}
