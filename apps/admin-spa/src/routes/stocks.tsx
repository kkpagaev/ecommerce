import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import { z } from "zod";
import React from "react";
import { SearchFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import { AdminOutputs } from "../utils/trpc";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { TooltipLink } from "@/components/ui/tooltip-link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { OutletDialog } from "@/components/ui/dialog-outlet";

type Product = Exclude<
  AdminOutputs["inventory"]["stocks"]["productListStocks"][0],
  null
>;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Route = createFileRoute("/stocks")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "Stocks" }),
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
    const products =
      await context.trpc.admin.inventory.stocks.productListStocks.fetch({
        languageId: deps.languageId,
        name: deps.name,
      });

    return { products };
  },
  component: Index,
});

function Index() {
  const { products } = Route.useLoaderData();

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
      <DataTable
        data={{ data: products, count: products.length }}
        columns={
          [
            {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
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
              accessorKey: "count",
              enableSorting: true,
            },
            {
              accessorKey: "images",
              enableSorting: false,
              cell: ({ row }) => {
                const ids = row.getValue<string[]>("images");
                if (!ids) {
                  return null;
                }
                return (
                  <AspectRatio
                    ratio={4 / 4}
                    className={"w-fullrounded-md border-slate-200 border-2"}
                  >
                    <img
                      src={
                        "http://localhost:3000/file-upload?imageId=" + ids[0]
                      }
                      className="w-full h-full object-cover rounded-md"
                    />
                  </AspectRatio>
                );
              },
            },
            {
              id: "actions",
              enableHiding: false,
              cell: ({ row }) => {
                return (
                  <div className="flex gap-2 flex-col">
                    <Link
                      to="/products/$productId/variants"
                      params={{ productId: "" + row.getValue("id") }}
                    >
                      <Button variant="default" className="w-full">
                        Edit variants
                      </Button>
                    </Link>
                    <Link
                      to="/stocks/$productId/edit"
                      params={{ productId: "" + row.getValue("id") }}
                    >
                      <Button variant="default" className="w-full">
                        Edit stocks
                      </Button>
                    </Link>
                  </div>
                );
              },
            },
          ] as ColumnDef<Product>[]
        }
        isLoading={false}
      />
      <OutletDialog path={Route.fullPath} />
    </div>
  );
}
