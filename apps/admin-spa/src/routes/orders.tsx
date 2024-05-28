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
import { AspectRatio } from "../components/ui/aspect-ratio";
import { ProductImage } from "../components/product-image";

// const data: {
//     id: number;
//     status: string;
//     items: {
//         name: string;
//         price: string;
//         order_id: number;
//         product_variant_id: number;
//         quantity: string;
//         short_description: string;
//     }[];
//     information: {
//         name: string;
//         email: string;
//         ... 5 more ...;
//         description: string;
//     };
//     createdAt: string;
// }[]
type Orders = AdminOutputs["orders"]["listOrders"][0];

const columns: ColumnDef<Orders>[] = [
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
    accessorKey: "status",
    enableSorting: true,
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "items",
    enableSorting: false,
    cell: ({ row }) => {
      const items: Array<{ images: Array<string> }> = row.getValue("items");
      if (!items) {
        return null;
      }
      return (
        <div>
          {items.map(({ images }) =>
            images.map((i) => {
              return <ProductImage id={i} key={i} />;
            }),
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    enableSorting: true,
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <TooltipLink
          to="/orders/$orderId"
          params={{ orderId: "" + row.getValue("id") }}
          text="View"
        >
          <Button variant="default">
            <Pencil1Icon />
          </Button>
        </TooltipLink>
      );
    },
  },
];

export const Route = createFileRoute("/orders")({
  component: Index,
  beforeLoad: async ({ context }) => {
    return {
      ...context,
      getTitle: () => "Orders",
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
    return await context.trpc.admin.orders.listOrders.fetch();
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
