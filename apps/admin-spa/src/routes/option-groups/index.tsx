import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../../components/data-table";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import { z } from "zod";
import { SearchFilters } from "../../components/search-filters";
import { TooltipLink } from "../../components/ui/tooltip-link";

type OptionGroups = Exclude<
  AdminOutputs["catalog"]["optionGroups"]["listOptionGroups"][0],
  null
>;

const columns: ColumnDef<OptionGroups>[] = [
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
    accessorKey: "type",
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{row.getValue("type")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <TooltipLink
          to="/attribute-groups/$attributeGroupId/"
          params={{ attributeGroupId: "" + row.getValue("id") }}
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

export const Route = createFileRoute("/option-groups/")({
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
    const optionGroups =
      await context.trpc.admin.catalog.optionGroups.listOptionGroups.fetch({
        languageId: deps.languageId,
        name: deps.name,
      });

    return optionGroups;
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
          <Link to={"/attribute-groups/new"}>
            <Button variant="default">New</Button>
          </Link>
        </div>
      </div>
      <DataTable
        data={data ? { data: data, count: data.length } : undefined}
        columns={columns}
        isLoading={false}
      />
    </div>
  );
}
