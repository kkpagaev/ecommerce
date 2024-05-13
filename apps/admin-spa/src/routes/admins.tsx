import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import { TooltipLink } from "@/components/ui/tooltip-link";
import { OutletDialog } from "@/components/ui/dialog-outlet";
import { z } from "zod";

type Admin = AdminOutputs["admin"]["listAdmins"][0];

const columns: ColumnDef<Admin>[] = [
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
    accessorKey: "email",
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <TooltipLink
          to="/admins/$adminId/edit"
          params={{ adminId: "" + row.getValue("id") }}
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

export const Route = createFileRoute("/admins")({
  component: Index,
  beforeLoad: async ({ context }) => {
    return {
      ...context,
      getTitle: () => "Languages",
    };
  },
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
      })
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    name: search.name,
    email: search.email,
  }),
  loader: async ({ context, deps }) => {
    return await context.trpc.admin.admin.listAdmins.fetch({
      name: deps.name,
      email: deps.email,
    });
  },
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div>
      <div>
        <Link to={"/admins/new"}>
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
