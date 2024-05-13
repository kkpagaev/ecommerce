import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { z } from "zod";
import React from "react";
import { SearchFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import { OutletDialog } from "@/components/ui/dialog-outlet";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Route = createFileRoute("/categories")({
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
  beforeLoad: async ({ context, search }) => {
    const categories =
      await context.trpc.admin.catalog.category.listCategories.fetch({
        languageId: search.languageId || 1,
      });
    return { ...context, categories, getTitle: () => "Categories" };
  },
  loader: ({ context }) => context.categories,
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div>
      <div className="w-full flex flex-row gap-10">
        <SearchFilters
          search={Route.useSearch()}
          fullPath={Route.fullPath}
          filters={[{ type: "languageId", name: "languageId" }]}
        />
        <div>
          <Link to={"/categories/new"}>
            <Button variant="default">New</Button>
          </Link>
        </div>
      </div>
      <DataTable
        data={{ data, count: data.length }}
        columns={columns}
        isLoading={false}
      />
      <OutletDialog path={Route.fullPath} />
    </div>
  );
}
