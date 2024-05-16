import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import { TooltipLink } from "@/components/ui/tooltip-link";
import { OutletDialog } from "@/components/ui/dialog-outlet";

type Vendor = AdminOutputs["vendor"]["list"][0];

const columns: ColumnDef<Vendor>[] = [
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
          to="/languages/$languageId/edit"
          params={{ languageId: "" + row.getValue("id") }}
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

export const Route = createFileRoute("/vendors")({
  component: Index,
  beforeLoad: async ({ context }) => {
    return {
      ...context,
      getTitle: () => "Vendors",
    };
  },
  loader: async ({ context }) => {
    return await context.trpc.admin.vendor.list.fetch();
  },
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div>
      <div>
        <Link to={"/vendors/new"}>
          <Button variant="default">New</Button>
        </Link>
      </div>
      <DataTable
        data={data ? { data: data, count: data.length } : undefined}
        columns={columns}
        isLoading={false}
      />
      <OutletDialog path={Route.fullPath} />
    </div>
  );
}
