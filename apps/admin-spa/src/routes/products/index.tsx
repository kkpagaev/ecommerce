import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import { z } from "zod";
import { SearchFilters } from "@/components/search-filters";
import { TooltipLink } from "@/components/ui/tooltip-link";

type Product = Exclude<
  AdminOutputs["catalog"]["product"]["listProducts"]["data"][0],
  null
>;

const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    enableSorting: true,
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    enableSorting: true,
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("name")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <TooltipLink
          to="/products/$productId/edit"
          params={{ productId: "" + row.getValue("id") }}
          text="Edit"
        >
          <Button variant="default">
            <Pencil1Icon />
          </Button>
        </TooltipLink>
      );
    },
  },
];

export const Route = createFileRoute("/products/")({
  component: Index,
  beforeLoad: async ({ context }) => {
    return {
      ...context,
      getTitle: () => "Attribute Groups",
    };
  },
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
    return await context.trpc.admin.catalog.product.listProducts.fetch({
      languageId: deps.languageId,
    });
  },
});

function Index() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <div className="container mx-auto py-10">
      <div className="w-full flex flex-row gap-10">
        <SearchFilters
          search={search}
          fullPath={Route.fullPath}
          filters={[
            {
              name: "name",
              type: "string",
              label: "Name",
            },
            {
              name: "languageId",
              type: "languageId",
            },
          ]}
        />
        <div>
          <Link to={"/products/new"}>
            <Button variant="default">New</Button>
          </Link>
        </div>
      </div>
      <DataTable
        data={data ? { data: data.data, count: data.count } : undefined}
        columns={columns}
        isLoading={false}
      />
    </div>
  );
}